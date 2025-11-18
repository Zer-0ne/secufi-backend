# Development Dockerfile
# Stage 1: Base with Node.js and Python
FROM node:22-alpine AS base

# Install Python and system dependencies
RUN apk add --no-cache \
    python3 \
    py3-pip \
    python3-dev \
    gcc \
    g++ \
    make \
    musl-dev \
    jpeg-dev \
    zlib-dev \
    libffi-dev \
    cairo-dev \
    pango-dev \
    gdk-pixbuf-dev \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    poppler-utils \
    && ln -sf python3 /usr/bin/python

WORKDIR /app

# Stage 2: Dependencies
FROM base AS dependencies

# Copy package files
COPY package.json package-lock.json* ./

# Install Node.js dependencies
RUN npm ci || npm install

# Install Python dependencies
COPY requirements.txt* ./
RUN pip3 install --no-cache-dir \
    PyMuPDF \
    pypdf \
    pdfplumber \
    tabula-py \
    pytesseract \
    pdf2image \
    Pillow \
    python-docx \
    openpyxl \
    pandas \
    || echo "Some Python packages failed to install"

# Stage 3: Build
FROM base AS build

WORKDIR /app

# Copy dependencies from previous stage
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /usr/lib/python3.* /usr/lib/python3.11
RUN export NODE_OPTIONS="--max-old-space-size=4096"

# Copy source code
COPY . .

# Copy Python script
COPY extractor.py ./

# Generate Prisma client
RUN npx prisma generate


ENV NODE_OPTIONS="--max-old-space-size=4096"


# Build TypeScript
RUN npm run build

# Stage 4: Production
FROM base AS production

WORKDIR /app

# Copy node_modules and Python libs
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=dependencies /usr/lib/python3.* /usr/lib/python3.11

# Copy built application
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/extractor.py ./

# Copy package.json and other necessary files
COPY package.json ./
COPY tsconfig.json* ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/index.js"]

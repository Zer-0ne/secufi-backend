# Production Dockerfile
FROM node:22-alpine

# Install build dependencies (temporarily) and runtime dependencies
RUN apk add --no-cache \
    # Runtime dependencies (permanent)
    python3 \
    py3-pip \
    tesseract-ocr \
    tesseract-ocr-data-eng \
    poppler-utils \
    mupdf-dev \
    freetype-dev \
    jbig2dec-dev \
    jpeg-dev \
    openjpeg-dev \
    harfbuzz-dev \
    && ln -sf python3 /usr/bin/python

# Add virtual build dependencies (will be removed later)
RUN apk add --no-cache --virtual .build-deps \
    gcc \
    g++ \
    make \
    musl-dev \
    python3-dev \
    clang-dev \
    linux-headers

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ONLY production dependencies (no devDependencies)
RUN npm ci --only=production

# Install Python packages with build dependencies present
RUN pip3 install --no-cache-dir --break-system-packages \
    PyMuPDF \
    pypdf \
    pdfplumber \
    tabula-py \
    pytesseract \
    pdf2image \
    Pillow \
    python-docx \
    openpyxl \
    pandas

# Remove build dependencies to save space (~200MB saved)
RUN apk del .build-deps

# Copy pre-built dist folder from your local machine
COPY dist ./dist

# Copy Prisma files
COPY prisma ./prisma

# Generate Prisma client (lightweight operation)
RUN npx prisma generate

# Copy Python script
COPY extractor.py ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/index.js"]

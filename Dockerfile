# Production Dockerfile - DEBIAN-BASED
FROM node:22-slim as production

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    tesseract-ocr \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install ONLY production Node.js dependencies
# RUN npm ci --only=production # comment this for prisma generate error prisma is in devDependency and version 6 and in build version 7 is used that it gives an error
RUN npm ci

# Install Python packages (uses pre-built wheels - FAST!)
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

# Copy pre-built dist folder
COPY dist ./dist

# Copy Prisma files
COPY prisma ./prisma

# Generate Prisma client (no DB connection needed)
RUN npx prisma generate

# ✅ Now remove dev dependencies
RUN npm prune --production && npm install prisma@6.19.0

# Copy Python script
COPY extractor.py ./

# Copy entrypoint script
COPY entrypoint.sh ./
RUN chmod +x entrypoint.sh

# Create non-root user
RUN groupadd -g 1001 nodejs && \
    useradd -u 1001 -g nodejs nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use entrypoint script
ENTRYPOINT ["./entrypoint.sh"]

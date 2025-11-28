#!/bin/sh
set -e

echo "🔧 Starting Secufi Backend (DEVELOPMENT)..."

# Wait for database
echo "⏳ Waiting for database..."
sleep 5

# Run migrations in dev mode
if [ -f "node_modules/.bin/prisma" ]; then
    echo "📦 Running dev migrations..."
    npx prisma migrate dev || \
    npx prisma db push --accept-data-loss || \
    echo "⚠️  Migration skipped"
fi

# Optional: Seed database
# echo "🌱 Seeding database..."
# npx prisma db seed || echo "⚠️  Seeding skipped"

# Start development server with hot reload
echo "✅ Starting development server..."
exec node dist/index.js


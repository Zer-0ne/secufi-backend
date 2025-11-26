#!/bin/sh
set -e

echo "🚀 Starting Secufi Backend..."

# Simple PostgreSQL wait
echo "⏳ Waiting for database..."
sleep 5

# Run migrations if prisma is available
if [ -f "node_modules/.bin/prisma" ]; then
    echo "📦 Running migrations..."
    node_modules/.bin/prisma migrate deploy --skip-generate || \
    node_modules/.bin/prisma db push --accept-data-loss --skip-generate || \
    echo "⚠️  Migration skipped"
fi

# Start server
echo "✅ Starting server..."
exec node dist/index.js

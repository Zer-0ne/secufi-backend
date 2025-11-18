#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."
until npx prisma db push --accept-data-loss 2>/dev/null || npx prisma migrate deploy; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is up - running migrations"
npx prisma migrate deploy

echo "Starting application..."
exec node dist/index.js

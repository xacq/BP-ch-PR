#!/bin/sh
set -e

echo "Applying database migrations..."
npx prisma migrate deploy

echo "Seeding database (idempotent)..."
npx prisma db seed

echo "Starting Next.js..."
exec npm run start

#!/bin/sh

# Wait for the database to be ready
echo "Waiting for PostgreSQL to be ready..."
until nc -z db 5432; do
  sleep 1
done
echo "PostgreSQL is up - continuing..."

# Run Prisma migration reset and seed
echo "Running Prisma migration reset..."
npx prisma migrate reset --force

echo "Seeding the database..."
npx tsx prisma/seed.ts

# Start the Next.js development server
echo "Starting Next.js development server..."
npm run dev

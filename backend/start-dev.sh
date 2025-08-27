#!/bin/bash

# Pin-a-Tree Backend Startup Script
# Run this after npm install completes

echo "🌳 Starting Pin-a-Tree Backend..."

# Check if we're in the backend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the backend directory"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "❌ Please run 'npm install' first"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "❌ Please copy .env.example to .env and configure it"
    exit 1
fi

# Generate Prisma client
echo "📦 Generating Prisma client..."
npm run db:generate

# Push database schema
echo "🗄️ Setting up database schema..."
npm run db:push

# Start the development server
echo "🚀 Starting development server..."
npm run dev

#!/bin/bash

# Print each command before executing
set -x

# Exit on any error
set -e

echo "🚀 Starting extension build process..."

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js and npm first."
    exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf extension/
rm -rf node_modules/
rm -rf package-lock.json  # Remove the lock file to ensure fresh dependencies

# Install dependencies
echo "📦 Installing dependencies..."
npm install --legacy-peer-deps --no-package-lock

# Build the extension
echo "🔨 Building the extension..."
npm run build

echo "✅ Build completed successfully!"
echo "📝 The extension can be found in the 'extension' directory"
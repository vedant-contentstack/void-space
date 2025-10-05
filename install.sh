#!/bin/bash

echo "🌌 Setting up Void Space..."

# Try to fix npm permissions
echo "Attempting to fix npm permissions..."
if sudo chown -R $(whoami) ~/.npm 2>/dev/null; then
    echo "✅ npm permissions fixed"
else
    echo "⚠️  Could not fix npm permissions automatically"
    echo "Please run: sudo chown -R $(whoami) ~/.npm"
fi

# Install dependencies
echo "Installing dependencies..."
if command -v yarn &> /dev/null; then
    echo "Using yarn..."
    yarn install
elif npm install; then
    echo "✅ Dependencies installed with npm"
else
    echo "❌ Failed to install dependencies"
    echo "Please try running: sudo chown -R $(whoami) ~/.npm"
    echo "Then run: npm install"
    exit 1
fi

echo "🚀 Setup complete! Run 'npm run dev' to start the development server."

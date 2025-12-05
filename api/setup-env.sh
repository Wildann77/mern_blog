#!/bin/bash

# Setup script untuk environment variables

echo "🚀 Setting up environment variables..."

# Check if .env exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " confirm
    if [ "$confirm" != "y" ] && [ "$confirm" != "Y" ]; then
        echo "❌ Setup cancelled."
        exit 0
    fi
fi

# Copy .env.example to .env
cp .env.example .env

echo "✅ .env file created from template"
echo ""
echo "📝 Please update the following values in .env file:"
echo "   1. MONGO - Your MongoDB connection string"
echo "   2. JWT_SECRET - A random secret key (min 32 characters)"
echo "   3. CLIENT_URL - Your frontend URL (if different from default)"
echo ""
echo "💡 To generate a secure JWT_SECRET, run:"
echo "   openssl rand -base64 32"
echo ""
echo "✅ Setup complete!"

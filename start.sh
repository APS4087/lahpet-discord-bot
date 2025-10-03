#!/bin/bash

echo "🚀 Lahpet Discord Bot - One-Click Deployment"
echo "============================================"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env file with your API keys before running the bot!"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Deploy Discord commands
echo "⚡ Deploying Discord slash commands..."
node src/deploy-commands.js

# Check if everything is ready
echo "🔍 Checking configuration..."

if grep -q "your_discord_bot_token_here" .env; then
    echo "❌ Please update DISCORD_TOKEN in .env file"
    exit 1
fi

if grep -q "your_discord_client_id_here" .env; then
    echo "❌ Please update DISCORD_CLIENT_ID in .env file"
    exit 1
fi

echo "✅ Configuration looks good!"
echo ""
echo "🎉 Starting Lahpet Bot..."
echo "📱 Discord Bot: Starting..."
echo "🌐 Web Dashboard: http://localhost:3000"
echo ""

# Start the bot
npm start
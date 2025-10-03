@echo off
echo 🚀 Lahpet Discord Bot - One-Click Deployment
echo ============================================

REM Check if .env exists
if not exist .env (
    echo 📝 Creating .env file...
    copy .env.example .env
    echo ⚠️  Please edit .env file with your API keys before running the bot!
    echo.
)

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Deploy Discord commands
echo ⚡ Deploying Discord slash commands...
call node src/deploy-commands.js

REM Check configuration
echo 🔍 Checking configuration...
findstr "your_discord_bot_token_here" .env >nul
if %errorlevel%==0 (
    echo ❌ Please update DISCORD_TOKEN in .env file
    pause
    exit /b 1
)

findstr "your_discord_client_id_here" .env >nul
if %errorlevel%==0 (
    echo ❌ Please update DISCORD_CLIENT_ID in .env file
    pause
    exit /b 1
)

echo ✅ Configuration looks good!
echo.
echo 🎉 Starting Lahpet Bot...
echo 📱 Discord Bot: Starting...
echo 🌐 Web Dashboard: http://localhost:3000
echo.

REM Start the bot
call npm start

pause
# Railway Deployment Guide

Railway is the easiest way to host your Discord bot for free with automatic deployments.

## Quick Deploy (Recommended)

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/discord-bot)

## Manual Setup

1. **Connect Repository**
   - Go to [Railway](https://railway.app)
   - Sign up with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your Lahpet repository

2. **Add Environment Variables**
   Go to your Railway project → Variables tab and add:
   ```
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   TMDB_API_KEY=your_tmdb_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   PORT=3000
   NODE_ENV=production
   ```

3. **Deploy**
   - Railway will automatically detect your Node.js app
   - It will run `npm install` and `npm start`
   - Your bot will be live in ~2 minutes!

## Custom Domain (Optional)
- Railway provides a free `.railway.app` domain
- You can add your own domain in the settings

## Monitoring
- View logs in real-time
- Automatic restarts if the app crashes
- Resource usage metrics

## Cost
- **Free Tier**: 512MB RAM, 1GB storage
- **Pro Plan**: $5/month for more resources if needed

Your bot URL will be: `https://your-app-name.railway.app`
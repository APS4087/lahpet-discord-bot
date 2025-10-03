# Render Deployment Guide

Render is another excellent free hosting option with great reliability.

## Setup Steps

1. **Create Account**
   - Go to [Render](https://render.com)
   - Sign up with GitHub

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the Lahpet repository

3. **Configuration**
   ```
   Name: lahpet-discord-bot
   Environment: Node
   Region: Choose closest to you
   Branch: main
   Root Directory: (leave empty)
   Build Command: npm install
   Start Command: npm start
   ```

4. **Environment Variables**
   Add these in the Environment section:
   ```
   DISCORD_TOKEN=your_bot_token_here
   DISCORD_CLIENT_ID=your_client_id_here
   TMDB_API_KEY=your_tmdb_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   NODE_ENV=production
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Render will build and deploy automatically
   - Takes about 3-5 minutes

## Free Tier Limits
- 750 hours/month (enough to run 24/7)
- Sleeps after 15 minutes of inactivity
- Wakes up automatically when accessed
- 512MB RAM, 1GB storage

## Keep-Alive (Optional)
To prevent sleeping, you can use a service like UptimeRobot to ping your app every 5 minutes.

Your bot URL will be: `https://your-app-name.onrender.com`
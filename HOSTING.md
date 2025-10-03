# 🚀 Complete Hosting Guide for Lahpet Bot

This guide covers all free hosting options for your Discord bot and web interface.

## 🎯 Quick Start (Easiest)

### Option 1: Railway (Recommended for Beginners)
**Best for: Complete beginners, automatic deployments**

1. **One-Click Deploy**: 
   [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app)

2. **Manual Setup**:
   - Fork this repository to your GitHub
   - Go to [Railway.app](https://railway.app) → Login with GitHub
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your forked repository
   - Add environment variables (see below)
   - Deploy! ✨

**Pros**: Automatic deployments, easy setup, great logs
**Cons**: Sleeps after inactivity (free tier)

---

### Option 2: Render
**Best for: Reliable hosting, good free tier**

1. Go to [Render.com](https://render.com)
2. Connect GitHub repository
3. Create "Web Service"
4. Configure:
   ```
   Build Command: npm install
   Start Command: npm start
   ```
5. Add environment variables
6. Deploy!

**Pros**: Very reliable, good performance, sleeps less
**Cons**: Slightly more complex setup

---

### Option 3: Vercel + Railway (Advanced)
**Best for: Maximum performance**

- **Vercel**: Host the beautiful web dashboard
- **Railway**: Host the Discord bot
- **Result**: Lightning-fast web interface + reliable bot

---

## 🔑 Environment Variables (Required)

Add these to your hosting platform:

```env
# Discord (Required)
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_client_id_here

# APIs (Optional - bot works without these)
TMDB_API_KEY=your_tmdb_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Server
PORT=3000
NODE_ENV=production
```

## 📋 How to Get API Keys

### Discord Bot (Required)
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" → Enter name "Lahpet"
3. Go to "Bot" → "Add Bot"
4. Copy **Token** → `DISCORD_TOKEN`
5. Go to "General Information" → Copy **Application ID** → `DISCORD_CLIENT_ID`

### TMDB (Free Movies)
1. Sign up at [TheMovieDB](https://www.themoviedb.org/)
2. Go to Settings → API → Create API Key
3. Copy **API Key** → `TMDB_API_KEY`

### Spotify (Free Music)
1. Go to [Spotify for Developers](https://developer.spotify.com/dashboard)
2. Create App → Copy **Client ID** and **Client Secret**
3. Add to `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`

## 🔗 Invite Bot to Server

Replace `YOUR_CLIENT_ID` with your actual Discord Client ID:

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147483648&scope=bot%20applications.commands
```

## 🐳 Alternative: Docker Deployment

For VPS or cloud servers:

```bash
# Build and run with Docker
npm run docker:build
npm run docker:run

# Or manually
docker build -t lahpet-bot .
docker run -d -p 3000:3000 --env-file .env lahpet-bot
```

## 📊 Free Tier Comparison

| Platform | RAM | Storage | Uptime | Custom Domain | Pros |
|----------|-----|---------|---------|--------------|------|
| Railway | 512MB | 1GB | Sleeps after 30min | ✅ | Easiest setup |
| Render | 512MB | 1GB | Sleeps after 15min | ✅ | Very reliable |
| Vercel | N/A | 100GB | Always on | ✅ | Ultra-fast (web only) |
| Heroku | 512MB | 1GB | Sleeps after 30min | ❌ | Popular choice |

## ⚡ Quick Local Testing

```bash
# Windows
start.bat

# Mac/Linux  
chmod +x start.sh
./start.sh

# Manual
npm install
npm run deploy
npm start
```

## 🚨 Troubleshooting

### Bot Not Responding
- Check `DISCORD_TOKEN` is correct
- Ensure bot is invited with proper permissions
- Run `npm run deploy` to refresh slash commands

### Web Interface Not Loading
- Check port 3000 is available
- Verify all dependencies installed: `npm install`
- Check hosting platform logs

### API Errors
- Bot works with mock data if APIs unavailable
- Check API keys are correct
- Verify rate limits not exceeded

## 🏆 Getting Discord Developer Badge

1. **Deploy your bot** ✅ (You're doing this!)
2. **Get users**: Share in Discord servers, Reddit, friends
3. **Stay active**: Keep bot online for 24+ hours
4. **Wait**: Discord reviews applications monthly

**Pro Tips**:
- Add to multiple servers
- Get friends to use commands
- Share screenshots on social media
- Join Discord developer communities

## 🎉 Success Checklist

- [ ] Bot responds to `/movie` command
- [ ] Web dashboard loads at your URL
- [ ] Bot stays online for 24+ hours
- [ ] Added to multiple Discord servers
- [ ] Friends are using the commands
- [ ] Shared on social media

Your bot is now ready for the world! 🌟

## 🆘 Need Help?

- **Check logs** in your hosting platform dashboard
- **Test locally** first with `npm start`
- **Discord support** in developer communities
- **GitHub Issues** on this repository

Happy coding! 🎮✨
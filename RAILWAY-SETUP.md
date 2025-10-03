# 🚀 Railway Deployment Guide - Step by Step

## 📋 Prerequisites Checklist
- [x] Discord Bot Token ✅ (Get from Discord Developer Portal)
- [x] TMDB API Key ✅ (Get from TMDB - optional)  
- [x] Spotify API Keys ✅ (Get from Spotify - optional)
- [ ] GitHub Repository
- [ ] Railway Account

---

## 🎯 STEP 1: Prepare Your Repository

### 1.1 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click **"New Repository"**
3. Name it: `lahpet-discord-bot`
4. Make it **Public** (required for free Railway)
5. Click **"Create Repository"**

### 1.2 Push Your Code
Open PowerShell in your project folder and run:

```powershell
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "🚀 Initial commit - Lahpet Discord Bot"

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/lahpet-discord-bot.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 🚂 STEP 2: Deploy on Railway

### 2.1 Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Click **"Login"**
3. Choose **"Login with GitHub"**
4. Authorize Railway to access your repositories

### 2.2 Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your `lahpet-discord-bot` repository
4. Click **"Deploy Now"**

Railway will automatically:
- Detect it's a Node.js project
- Run `npm install`
- Try to start with `npm start`

---

## ⚙️ STEP 3: Configure Environment Variables

### 3.1 Add Environment Variables
1. In your Railway project dashboard, click **"Variables"** tab
2. Add these variables one by one:

```env
DISCORD_TOKEN=your_actual_discord_bot_token
DISCORD_CLIENT_ID=your_actual_client_id
TMDB_API_KEY=your_actual_tmdb_key
SPOTIFY_CLIENT_ID=your_actual_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_actual_spotify_secret
PORT=3000
NODE_ENV=production
JWT_SECRET=lahpet_super_secret_jwt_key_2024
```

### 3.2 Optional Variables
```env
WEB_URL=https://your-project-name.railway.app
DATABASE_URL=./data/database.sqlite
```

---

## 🔧 STEP 4: Deploy Discord Commands

### 4.1 One-Time Setup
After your bot is deployed, you need to register the slash commands:

1. Go to Railway **"Deployments"** tab
2. Click on your latest deployment
3. Click **"View Logs"**
4. Wait for the deployment to finish

### 4.2 Register Commands
In the Railway logs, you should see:
```
✅ Loaded command: dashboard
✅ Loaded command: movie  
✅ Loaded command: music
🚀 Bot is online and ready!
```

If commands aren't working, run this once:
1. Go to **"Settings"** → **"Environment"**
2. Add a new deploy trigger or redeploy

---

## 🤖 STEP 5: Invite Bot to Discord Server

### 5.1 Generate Invite Link
Replace `YOUR_CLIENT_ID` with your actual Client ID:

```
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147483648&scope=bot%20applications.commands
```

### 5.2 Add to Server
1. Open the invite link
2. Select your Discord server
3. Click **"Authorize"**
4. Complete the captcha

---

## 🌐 STEP 6: Access Your Web Dashboard

### 6.1 Get Your URL
1. In Railway dashboard, go to **"Settings"**
2. Find **"Public Domain"** 
3. Your URL will be: `https://your-project-name.railway.app`

### 6.2 Update Bot Commands (Optional)
Add your web URL to environment variables:
```env
WEB_URL=https://your-actual-railway-url.railway.app
```

---

## ✅ STEP 7: Test Everything

### 7.1 Test Discord Commands
In your Discord server, try:
- `/movie action` - Should show movie recommendations
- `/music pop` - Should show music recommendations  
- `/dashboard` - Should give you a web link

### 7.2 Test Web Interface
1. Visit your Railway URL
2. Go to `/dashboard`
3. Try filtering movies and music

---

## 🎯 STEP 8: Keep It Running (Free Tier)

### 8.1 Understanding Railway Free Tier
- **512MB RAM, 1GB Storage**
- **$5 free credit monthly**
- **Sleeps after ~30 minutes of inactivity**
- **Wakes up automatically when accessed**

### 8.2 Keep Alive (Optional)
To prevent sleeping, use [UptimeRobot](https://uptimerobot.com):
1. Create free account
2. Add HTTP monitor for your Railway URL
3. Set to ping every 5 minutes

---

## 🏆 STEP 9: Get Discord Developer Badge

### 9.1 Requirements Met ✅
- [x] Created Discord Application
- [x] Uses Slash Commands
- [x] Deployed and running
- [x] Professional quality

### 9.2 Get Users
1. **Share in Discord servers** you're in
2. **Post on Reddit** r/discordbots, r/programming
3. **Tell friends** to use the commands
4. **Keep online** for 24+ hours continuously

### 9.3 Badge Timeline
- Discord reviews applications **monthly**
- Need **active usage** from real users
- Usually takes **1-3 months** to receive

---

## 🚨 Troubleshooting

### Bot Not Responding
```bash
# Check Railway logs for errors
# Usually means Discord token is wrong
```

### Web Interface 404
```bash
# Make sure PORT=3000 is set
# Check Railway deployment logs
```

### Commands Not Appearing
```bash
# Redeploy the project in Railway
# Discord can take up to 1 hour for global commands
```

---

## 🎉 Success Checklist

- [ ] Repository pushed to GitHub
- [ ] Railway project created and deployed
- [ ] Environment variables added
- [ ] Bot invited to Discord server
- [ ] Commands working (`/movie`, `/music`, `/dashboard`)
- [ ] Web interface accessible
- [ ] Shared with friends/communities
- [ ] Running for 24+ hours

## 📞 Support

If you need help:
1. **Check Railway logs** first
2. **Test locally** with `npm start`
3. **Discord Developer Portal** for bot issues
4. **Railway Discord** community for hosting issues

Your bot is now live and ready to earn you that Discord Developer Badge! 🏆✨

---

**🔗 Your URLs:**
- **Railway Dashboard**: https://railway.app/project/your-project
- **Bot Web Interface**: https://your-project.railway.app
- **Discord Invite**: Use the link from Step 5.1

**Next**: Share your bot and get users! 🚀
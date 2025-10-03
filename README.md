# 🎬 Lahpet - AI-Powered Movie & Music Recommendations

[![Discord Bot](https://img.shields.io/badge/Discord-Bot-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

> A beautiful Discord bot with a stunning web interface that provides personalized movie and music recommendations. Inspired by Awwwards design excellence.

## ✨ Features

- 🎬 **Movie Recommendations** - Powered by TMDB API
- 🎵 **Music Discovery** - Integrated with Spotify API  
- 🤖 **Discord Bot** - Easy-to-use slash commands
- 🌟 **Beautiful Web Interface** - Award-winning design
- 📱 **Responsive Design** - Works on all devices
- 🆓 **Free Hosting Ready** - Deploy on Railway, Render, or Vercel
- 🎯 **Personalized** - Recommendations based on mood and genre
- ⚡ **Fast & Reliable** - Built with modern technologies

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- Discord Developer Account
- TMDB API Key (free)
- Spotify API Credentials (free)

### 1. Clone & Install

\`\`\`bash
git clone https://github.com/yourusername/lahpet-bot
cd lahpet-bot
npm install
\`\`\`

### 2. Environment Setup

Copy \`.env.example\` to \`.env\` and fill in your credentials:

\`\`\`env
# Discord Bot
DISCORD_TOKEN=your_discord_bot_token_here
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_GUILD_ID=your_test_guild_id_here

# Web Interface
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_here

# API Keys
TMDB_API_KEY=your_tmdb_api_key_here
SPOTIFY_CLIENT_ID=your_spotify_client_id_here
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here

# Database
DATABASE_URL=./data/database.sqlite
NODE_ENV=development
\`\`\`

### 3. Get Your API Keys

#### Discord Bot Setup
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Click "New Application" and give it a name
3. Go to "Bot" section and create a bot
4. Copy the **Token** → \`DISCORD_TOKEN\`
5. Go to "General Information" and copy **Application ID** → \`DISCORD_CLIENT_ID\`
6. For testing, copy your Discord server ID → \`DISCORD_GUILD_ID\`

#### TMDB API (Free)
1. Sign up at [TMDB](https://www.themoviedb.org/)
2. Go to Settings → API → Create API Key
3. Copy the **API Key** → \`TMDB_API_KEY\`

#### Spotify API (Free)
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy **Client ID** → \`SPOTIFY_CLIENT_ID\`
4. Copy **Client Secret** → \`SPOTIFY_CLIENT_SECRET\`

### 4. Deploy Commands & Run

\`\`\`bash
# Deploy Discord commands
node src/deploy-commands.js

# Start the bot and web server
npm start

# Or for development
npm run dev
\`\`\`

### 5. Invite Bot to Server

Use this URL (replace YOUR_CLIENT_ID):
\`\`\`
https://discord.com/oauth2/authorize?client_id=YOUR_CLIENT_ID&permissions=2147483648&scope=bot%20applications.commands
\`\`\`

## 🎯 Discord Commands

- \`/movie [genre] [mood]\` - Get movie recommendations
- \`/music [genre] [mood]\` - Discover new music  
- \`/dashboard\` - Access your web dashboard

## 🌐 Web Dashboard

Access the beautiful web interface at:
- **Local**: http://localhost:3000
- **Dashboard**: http://localhost:3000/dashboard

## 🚀 Free Hosting Options

### Railway (Recommended)
1. Connect your GitHub repo to [Railway](https://railway.app)
2. Add environment variables in Railway dashboard
3. Deploy automatically!

### Render
1. Connect repo to [Render](https://render.com)
2. Set build command: \`npm install\`
3. Set start command: \`npm start\`
4. Add environment variables

### Vercel (Web Interface Only)
1. Deploy to [Vercel](https://vercel.com) for the web interface
2. Use Railway/Render for the Discord bot

## 🏆 Getting Discord Developer Badge

To earn your Discord Developer Badge:

1. **Create a Discord App** ✅ (You did this!)
2. **Use Slash Commands** ✅ (Your bot has them!)
3. **Have Active Users**: Get friends to use your bot
4. **Wait for Badge**: Discord reviews monthly

**Pro Tips:**
- Share your bot in developer communities
- Add it to multiple servers
- Keep it online for 24+ hours
- Have real users interact with commands

## 📁 Project Structure

\`\`\`
lahpet-bot/
├── src/
│   ├── commands/          # Discord slash commands
│   ├── events/            # Discord event handlers
│   ├── services/          # API integrations
│   ├── web/               # Web interface
│   ├── deploy-commands.js # Command deployment
│   └── index.js          # Bot entry point
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md            # This file
\`\`\`

## 🛠️ Development Scripts

\`\`\`bash
npm start          # Start bot + web server
npm run dev        # Development mode with nodemon  
npm run web        # Web server only
npm run dev:web    # Web server development mode
\`\`\`

## 🎨 Design Inspiration

This project draws inspiration from award-winning designs on [Awwwards](https://awwwards.com), featuring:
- Smooth animations and transitions
- Modern glassmorphism effects
- Beautiful gradient backgrounds
- Responsive grid layouts
- Interactive hover effects

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and building!

## 🆘 Troubleshooting

### Bot Not Responding
- Check your \`DISCORD_TOKEN\` is correct
- Ensure bot has proper permissions
- Run \`node src/deploy-commands.js\` to refresh commands

### API Errors
- Verify API keys are correct
- Check rate limits
- Bot works with mock data if APIs are unavailable

### Web Interface Issues  
- Check port 3000 is available
- Ensure all dependencies are installed
- Check browser console for errors

## 🌟 Support

If you found this helpful:
- ⭐ Star the repository
- 🐛 Report bugs in Issues
- 💡 Suggest features
- 📧 Contact: [your-email@example.com]

---

**Made with ❤️ for the Discord developer community**
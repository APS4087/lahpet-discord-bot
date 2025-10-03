# Vercel Deployment (Web Interface Only)

Vercel is perfect for hosting the web dashboard with lightning-fast global CDN.

## Setup for Web Interface

1. **Separate Web Files**
   The web interface can be deployed separately from the bot for better performance.

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Configure build settings:
     ```
     Framework Preset: Other
     Root Directory: src/web
     Build Command: (leave empty)
     Output Directory: public
     ```

3. **Environment Variables**
   Add in Vercel dashboard:
   ```
   NODE_ENV=production
   TMDB_API_KEY=your_tmdb_key_here
   SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret_here
   ```

## Why Use Vercel for Web Interface?
- **Ultra-fast**: Global CDN with edge locations
- **Free SSL**: Automatic HTTPS
- **Custom Domain**: Free .vercel.app domain
- **Automatic Deployments**: Updates on every git push
- **Zero Configuration**: Just works out of the box

## Combined Approach (Recommended)
- **Railway/Render**: Discord bot backend
- **Vercel**: Web dashboard frontend
- **Better Performance**: Specialized hosting for each part

Your dashboard URL: `https://your-project.vercel.app`
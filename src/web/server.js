const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const { getMovieRecommendations, getPopularMovies } = require('../services/movieService');
const { getMusicRecommendations, getTopTracks } = require('../services/musicService');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            connectSrc: ["'self'", "https:"]
        }
    }
}));

// Basic rate limiting (simplified for deployment)
const requestCounts = new Map();
const rateLimit = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    
    if (!requestCounts.has(ip)) {
        requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
    } else {
        const data = requestCounts.get(ip);
        if (now > data.resetTime) {
            data.count = 1;
            data.resetTime = now + windowMs;
        } else {
            data.count++;
            if (data.count > 100) {
                return res.status(429).json({ error: 'Too many requests' });
            }
        }
    }
    next();
};
app.use(rateLimit);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// API Routes
app.get('/api/movies', async (req, res) => {
    try {
        const { genre, mood, page } = req.query;
        const movies = await getMovieRecommendations({ genre, mood, page: parseInt(page) || 1 });
        res.json({ success: true, data: movies });
    } catch (error) {
        console.error('Movies API error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch movies' });
    }
});

app.get('/api/movies/popular', async (req, res) => {
    try {
        const { page } = req.query;
        const movies = await getPopularMovies(parseInt(page) || 1);
        res.json({ success: true, data: movies });
    } catch (error) {
        console.error('Popular movies API error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch popular movies' });
    }
});

app.get('/api/music', async (req, res) => {
    try {
        const { genre, mood, limit } = req.query;
        const tracks = await getMusicRecommendations({ genre, mood, limit: parseInt(limit) || 10 });
        res.json({ success: true, data: tracks });
    } catch (error) {
        console.error('Music API error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch music' });
    }
});

app.get('/api/music/top', async (req, res) => {
    try {
        const { limit } = req.query;
        const tracks = await getTopTracks(parseInt(limit) || 20);
        res.json({ success: true, data: tracks });
    } catch (error) {
        console.error('Top music API error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch top music' });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        port: PORT,
        env: process.env.NODE_ENV
    });
});

// Root endpoint for basic connectivity test
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 404 handler
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server when imported
const server = app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
    console.log(`🎨 Beautiful dashboard available at /dashboard`);
});

module.exports = { app, server };
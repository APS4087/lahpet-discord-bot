const axios = require('axios');

let spotifyToken = null;
let tokenExpiration = null;

async function getSpotifyToken() {
    if (spotifyToken && tokenExpiration && Date.now() < tokenExpiration) {
        return spotifyToken;
    }

    try {
        if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
            return null;
        }

        const response = await axios.post('https://accounts.spotify.com/api/token', 
            'grant_type=client_credentials', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET
                ).toString('base64')
            }
        });

        spotifyToken = response.data.access_token;
        tokenExpiration = Date.now() + (response.data.expires_in * 1000);
        return spotifyToken;
        
    } catch (error) {
        console.error('Spotify token error:', error.response?.data || error.message);
        return null;
    }
}

async function getMusicRecommendations({ genre, mood, limit = 10 } = {}) {
    try {
        const token = await getSpotifyToken();
        
        if (!token) {
            return getMockTracks(genre);
        }

        // Build search query based on genre and mood
        let query = '';
        if (genre) {
            query += `genre:${genre}`;
        }
        
        // Add mood-based attributes
        let seedGenres = [];
        let targetAttributes = {};
        
        switch (mood) {
            case 'energetic':
                targetAttributes = { target_energy: 0.8, target_danceability: 0.7 };
                break;
            case 'chill':
                targetAttributes = { target_energy: 0.3, target_valence: 0.5 };
                break;
            case 'melancholic':
                targetAttributes = { target_valence: 0.2, target_energy: 0.4 };
                break;
            case 'upbeat':
                targetAttributes = { target_valence: 0.8, target_energy: 0.7 };
                break;
            case 'focus':
                targetAttributes = { target_instrumentalness: 0.7, target_energy: 0.5 };
                break;
        }

        // If we have a specific genre, use recommendations endpoint
        if (genre) {
            seedGenres = [genre.replace('-', '')];
            const params = new URLSearchParams({
                seed_genres: seedGenres.join(','),
                limit: limit.toString(),
                ...targetAttributes
            });

            const response = await axios.get(
                `https://api.spotify.com/v1/recommendations?${params}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return response.data.tracks;
        } else {
            // Use search endpoint for general queries
            const searchQuery = query || 'year:2020-2024';
            const response = await axios.get(
                `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return response.data.tracks.items;
        }

    } catch (error) {
        console.error('Spotify API error:', error.response?.data || error.message);
        return getMockTracks(genre);
    }
}

function getMockTracks(genre) {
    const mockTracks = {
        pop: [
            {
                name: "Blinding Lights",
                artists: [{ name: "The Weeknd" }],
                album: {
                    name: "After Hours",
                    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273ef017e899c0547766997d874" }]
                },
                duration_ms: 200040,
                external_urls: { spotify: "https://open.spotify.com/track/0VjIjW4GlULA8wcaOjUt27" }
            }
        ],
        rock: [
            {
                name: "Bohemian Rhapsody",
                artists: [{ name: "Queen" }],
                album: {
                    name: "A Night at the Opera",
                    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273e319baafd16e84f0408af2a0" }]
                },
                duration_ms: 354320,
                external_urls: { spotify: "https://open.spotify.com/track/1AhDOtG9vPSOmsWgNW0BEY" }
            }
        ],
        default: [
            {
                name: "Shape of You",
                artists: [{ name: "Ed Sheeran" }],
                album: {
                    name: "÷ (Divide)",
                    images: [{ url: "https://i.scdn.co/image/ab67616d0000b273ba5db46f4b838ef6027e6f96" }]
                },
                duration_ms: 233713,
                external_urls: { spotify: "https://open.spotify.com/track/7qiZfU4dY1lWllzX7mPBI3" }
            }
        ]
    };
    
    return mockTracks[genre] || mockTracks.default;
}

async function getTopTracks(limit = 20) {
    try {
        const token = await getSpotifyToken();
        
        if (!token) {
            return getMockTracks('default');
        }

        // Get featured playlists and extract tracks
        const response = await axios.get(
            `https://api.spotify.com/v1/browse/featured-playlists?limit=1`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        );

        if (response.data.playlists.items.length > 0) {
            const playlistId = response.data.playlists.items[0].id;
            const tracksResponse = await axios.get(
                `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=${limit}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            return tracksResponse.data.items.map(item => item.track);
        }

        return getMockTracks('default');
    } catch (error) {
        console.error('Spotify top tracks error:', error);
        return getMockTracks('default');
    }
}

module.exports = {
    getMusicRecommendations,
    getTopTracks
};
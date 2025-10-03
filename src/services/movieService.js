const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Genre mapping
const genreMap = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    science_fiction: 878,
    thriller: 53,
    war: 10752,
    western: 37
};

async function getMovieRecommendations({ genre, mood, page = 1 } = {}) {
    try {
        if (!process.env.TMDB_API_KEY) {
            // Return mock data if no API key
            return getMockMovies(genre);
        }

        let url = `${TMDB_BASE_URL}/discover/movie?api_key=${process.env.TMDB_API_KEY}`;
        
        // Add genre filter
        if (genre && genreMap[genre]) {
            url += `&with_genres=${genreMap[genre]}`;
        }
        
        // Add sorting based on mood
        switch (mood) {
            case 'feel_good':
                url += '&sort_by=popularity.desc&vote_average.gte=7';
                break;
            case 'intense':
                url += '&sort_by=vote_count.desc&with_genres=28,53'; // Action, Thriller
                break;
            case 'relaxing':
                url += '&sort_by=vote_average.desc&with_genres=18,10749'; // Drama, Romance
                break;
            case 'mind_bending':
                url += '&with_genres=878,9648&sort_by=vote_average.desc'; // Sci-Fi, Mystery
                break;
            case 'nostalgic':
                url += '&primary_release_date.lte=2000-12-31&sort_by=popularity.desc';
                break;
            default:
                url += '&sort_by=popularity.desc';
        }
        
        url += `&page=${page}&vote_count.gte=100`;

        const response = await axios.get(url);
        return response.data.results.slice(0, 10); // Return top 10 results
        
    } catch (error) {
        console.error('TMDB API error:', error.response?.data || error.message);
        return getMockMovies(genre);
    }
}

function getMockMovies(genre) {
    const mockMovies = {
        action: [
            {
                title: "Mad Max: Fury Road",
                overview: "An apocalyptic story set in the furthest reaches of our planet, in a stark desert landscape where humanity is broken.",
                vote_average: 7.6,
                release_date: "2015-05-15",
                poster_path: "/hA2ple9q4qnwxp3hKVNhroipsir.jpg"
            }
        ],
        comedy: [
            {
                title: "The Grand Budapest Hotel",
                overview: "The adventures of Gustave H, a legendary concierge at a famous European hotel.",
                vote_average: 8.1,
                release_date: "2014-02-26",
                poster_path: "/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg"
            }
        ],
        default: [
            {
                title: "The Shawshank Redemption",
                overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
                vote_average: 9.3,
                release_date: "1994-09-23",
                poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
            }
        ]
    };
    
    return mockMovies[genre] || mockMovies.default;
}

async function getPopularMovies(page = 1) {
    try {
        if (!process.env.TMDB_API_KEY) {
            return getMockMovies('default');
        }

        const response = await axios.get(`${TMDB_BASE_URL}/movie/popular?api_key=${process.env.TMDB_API_KEY}&page=${page}`);
        return response.data.results;
    } catch (error) {
        console.error('TMDB Popular movies error:', error);
        return getMockMovies('default');
    }
}

module.exports = {
    getMovieRecommendations,
    getPopularMovies
};
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMovieRecommendations } = require('../services/movieService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('movie')
        .setDescription('Get personalized movie recommendations')
        .addStringOption(option =>
            option.setName('genre')
                .setDescription('Movie genre preference')
                .setRequired(false)
                .addChoices(
                    { name: 'Action', value: 'action' },
                    { name: 'Comedy', value: 'comedy' },
                    { name: 'Drama', value: 'drama' },
                    { name: 'Horror', value: 'horror' },
                    { name: 'Romance', value: 'romance' },
                    { name: 'Sci-Fi', value: 'science_fiction' },
                    { name: 'Thriller', value: 'thriller' },
                    { name: 'Animation', value: 'animation' }
                ))
        .addStringOption(option =>
            option.setName('mood')
                .setDescription('What kind of mood are you in?')
                .setRequired(false)
                .addChoices(
                    { name: 'Feel Good', value: 'feel_good' },
                    { name: 'Intense', value: 'intense' },
                    { name: 'Relaxing', value: 'relaxing' },
                    { name: 'Mind-bending', value: 'mind_bending' },
                    { name: 'Nostalgic', value: 'nostalgic' }
                )),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const genre = interaction.options.getString('genre');
            const mood = interaction.options.getString('mood');

            const movies = await getMovieRecommendations({ genre, mood });

            if (!movies || movies.length === 0) {
                return await interaction.editReply('😅 No movies found! Try a different genre or mood.');
            }

            const movie = movies[0]; // Get the top recommendation

            const embed = new EmbedBuilder()
                .setTitle(`🎬 ${movie.title}`)
                .setDescription(movie.overview || 'No description available.')
                .setColor(0xFF6B6B)
                .addFields(
                    { name: '⭐ Rating', value: movie.vote_average ? `${movie.vote_average}/10` : 'N/A', inline: true },
                    { name: '📅 Release Date', value: movie.release_date || 'Unknown', inline: true },
                    { name: '🎭 Genre', value: genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : 'Various', inline: true }
                )
                .setFooter({ text: '🎯 Powered by Lahpet • Get more recommendations on our web dashboard!' })
                .setTimestamp();

            if (movie.poster_path) {
                embed.setImage(`https://image.tmdb.org/t/p/w500${movie.poster_path}`);
            }

            await interaction.editReply({
                embeds: [embed],
                components: [{
                    type: 1,
                    components: [{
                        type: 2,
                        style: 5,
                        label: 'View More Recommendations',
                        url: process.env.WEB_URL || `http://localhost:3000/dashboard?user=${interaction.user.id}`
                    }]
                }]
            });

        } catch (error) {
            console.error('Movie command error:', error);
            await interaction.editReply('❌ Failed to fetch movie recommendations. Please try again later!');
        }
    },
};
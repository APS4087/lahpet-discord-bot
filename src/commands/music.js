const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getMusicRecommendations } = require('../services/musicService');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('music')
        .setDescription('Get personalized music recommendations')
        .addStringOption(option =>
            option.setName('genre')
                .setDescription('Music genre preference')
                .setRequired(false)
                .addChoices(
                    { name: 'Pop', value: 'pop' },
                    { name: 'Rock', value: 'rock' },
                    { name: 'Hip-Hop', value: 'hip-hop' },
                    { name: 'Electronic', value: 'electronic' },
                    { name: 'Jazz', value: 'jazz' },
                    { name: 'Classical', value: 'classical' },
                    { name: 'R&B', value: 'rnb' },
                    { name: 'Indie', value: 'indie' }
                ))
        .addStringOption(option =>
            option.setName('mood')
                .setDescription('What kind of vibe are you looking for?')
                .setRequired(false)
                .addChoices(
                    { name: 'Energetic', value: 'energetic' },
                    { name: 'Chill', value: 'chill' },
                    { name: 'Melancholic', value: 'melancholic' },
                    { name: 'Upbeat', value: 'upbeat' },
                    { name: 'Focus', value: 'focus' }
                )),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const genre = interaction.options.getString('genre');
            const mood = interaction.options.getString('mood');

            const tracks = await getMusicRecommendations({ genre, mood });

            if (!tracks || tracks.length === 0) {
                return await interaction.editReply('😅 No music found! Try a different genre or mood.');
            }

            const track = tracks[0]; // Get the top recommendation

            const embed = new EmbedBuilder()
                .setTitle(`🎵 ${track.name}`)
                .setDescription(`by **${track.artists[0]?.name || 'Unknown Artist'}**`)
                .setColor(0x4ECDC4)
                .addFields(
                    { name: '💿 Album', value: track.album?.name || 'Unknown Album', inline: true },
                    { name: '⏱️ Duration', value: track.duration_ms ? `${Math.floor(track.duration_ms / 60000)}:${String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}` : 'Unknown', inline: true },
                    { name: '🎯 Genre', value: genre ? genre.charAt(0).toUpperCase() + genre.slice(1) : 'Various', inline: true }
                )
                .setFooter({ text: '🎯 Powered by Lahpet • Get more recommendations on our web dashboard!' })
                .setTimestamp();

            if (track.album?.images?.[0]?.url) {
                embed.setThumbnail(track.album.images[0].url);
            }

            const components = [];
            if (track.external_urls?.spotify) {
                components.push({
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 5,
                            label: 'Listen on Spotify',
                            url: track.external_urls.spotify
                        },
                        {
                            type: 2,
                            style: 5,
                            label: 'View More Recommendations',
                            url: process.env.WEB_URL || `http://localhost:3000/dashboard?user=${interaction.user.id}`
                        }
                    ]
                });
            }

            await interaction.editReply({
                embeds: [embed],
                components
            });

        } catch (error) {
            console.error('Music command error:', error);
            await interaction.editReply('❌ Failed to fetch music recommendations. Please try again later!');
        }
    },
};
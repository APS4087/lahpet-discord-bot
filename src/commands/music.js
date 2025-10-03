const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { getMusicRecommendations } = require('../services/musicService');
const musicPlayer = require('../services/musicPlayer');

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
                ))
        .addBooleanOption(option =>
            option.setName('autoplay')
                .setDescription('Automatically play the music in your voice channel')
                .setRequired(false)),

    async execute(interaction) {
        await interaction.deferReply();

        try {
            const genre = interaction.options.getString('genre');
            const mood = interaction.options.getString('mood');
            const autoplay = interaction.options.getBoolean('autoplay') || false;

            const tracks = await getMusicRecommendations({ genre, mood });

            if (!tracks || tracks.length === 0) {
                return await interaction.editReply('😅 No music found! Try a different genre or mood.');
            }

            const track = tracks[0]; // Get the top recommendation

            let playbackStatus = '';
            let playbackError = null;

            // Auto-play if requested and user is in voice channel
            if (autoplay) {
                try {
                    const member = interaction.member;
                    if (!member.voice.channel) {
                        playbackStatus = '\n⚠️ **Join a voice channel to enable autoplay!**';
                    } else {
                        await interaction.editReply('🎵 Finding and playing your music...');
                        const result = await musicPlayer.playTrack(interaction, track);
                        if (result.success) {
                            if (result.fallback) {
                                playbackStatus = `\n⚠️ **Joined ${result.channel}** - ${result.message || 'Audio streaming temporarily unavailable'}`;
                            } else {
                                playbackStatus = `\n🔊 **Now playing "${result.track.title}" in ${result.channel}!**`;
                            }
                        }
                    }
                } catch (error) {
                    console.error('Autoplay error:', error);
                    playbackStatus = `\n❌ **Playback failed:** ${error.message}`;
                    playbackError = error.message;
                }
            }

            const embed = new EmbedBuilder()
                .setTitle(`🎵 ${track.name}${autoplay && !playbackError ? ' 🔊' : ''}`)
                .setDescription(`by **${track.artists[0]?.name || 'Unknown Artist'}**${playbackStatus}`)
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
            
            // First row - Playback controls
            if (!autoplay) {
                components.push({
                    type: 1,
                    components: [
                        {
                            type: 2,
                            style: 3, // Green button
                            label: '🔊 Play in Voice',
                            custom_id: `play_track_${interaction.user.id}`,
                            disabled: false
                        },
                        {
                            type: 2,
                            style: 4, // Red button
                            label: '⏹️ Stop',
                            custom_id: `stop_music_${interaction.guild.id}`,
                            disabled: false
                        }
                    ]
                });
            }

            // Second row - External links
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
                            url: process.env.WEB_URL || `https://lahpet-discord-bot.onrender.com/dashboard?user=${interaction.user.id}`
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
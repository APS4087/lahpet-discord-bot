const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const musicPlayer = require('../services/reliableMusicPlayer');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Play, stop, or control music in voice channel')
        .addSubcommand(subcommand =>
            subcommand
                .setName('search')
                .setDescription('Search and play a specific song')
                .addStringOption(option =>
                    option.setName('query')
                        .setDescription('Song or artist name to search for')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('stop')
                .setDescription('Stop playing music and leave voice channel'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('status')
                .setDescription('Check if music is currently playing')),

    async execute(interaction) {
        await interaction.deferReply();

        const subcommand = interaction.options.getSubcommand();

        try {
            switch (subcommand) {
                case 'search':
                    const query = interaction.options.getString('query');
                    const member = interaction.member;

                    if (!member.voice.channel) {
                        return await interaction.editReply('❌ You need to be in a voice channel to play music!');
                    }

                    await interaction.editReply(`🔍 Searching for "${query}"...`);

                    const mockTrack = {
                        name: query,
                        artists: [{ name: 'Various Artists' }]
                    };

                    const result = await musicPlayer.playTrack(interaction, mockTrack);
                    
                    if (result.success) {
                        if (result.fallback) {
                            await interaction.editReply(`⚠️ **Joined ${result.channel}** - ${result.message}`);
                        } else {
                            const sourceInfo = result.track.source ? ` via ${result.track.source}` : '';
                            const embed = new EmbedBuilder()
                                .setTitle(`🎵 Now Playing`)
                                .setDescription(`**${result.track.title || query}**\n🔊 Playing in **${result.channel}**${sourceInfo}`)
                                .setColor(0x4ECDC4)
                                .addFields(
                                    { name: '📱 Source', value: result.track.source || 'Unknown', inline: true },
                                    { name: '⏱️ Duration', value: result.track.duration ? `${Math.floor(result.track.duration / 60)}:${String(result.track.duration % 60).padStart(2, '0')}` : 'Unknown', inline: true }
                                )
                                .setFooter({ text: '🎯 Use /play stop to stop playback' })
                                .setTimestamp();

                            await interaction.editReply({ embeds: [embed] });
                        }
                    } else {
                        await interaction.editReply('❌ Could not find or play that song. Try a different search term.');
                    }
                    break;

                case 'stop':
                    await musicPlayer.stop(interaction.guild.id);
                    
                    const stopEmbed = new EmbedBuilder()
                        .setTitle('⏹️ Music Stopped')
                        .setDescription('Stopped playing music and left the voice channel.')
                        .setColor(0xFF6B6B)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [stopEmbed] });
                    break;

                case 'status':
                    const isPlaying = musicPlayer.isPlaying(interaction.guild.id);
                    
                    const statusEmbed = new EmbedBuilder()
                        .setTitle('🎵 Music Status')
                        .setDescription(isPlaying ? '▶️ **Currently playing music**' : '⏸️ **No music playing**')
                        .setColor(isPlaying ? 0x4ECDC4 : 0x95A5A6)
                        .setTimestamp();

                    await interaction.editReply({ embeds: [statusEmbed] });
                    break;
            }

        } catch (error) {
            console.error('Play command error:', error);
            await interaction.editReply(`❌ **Error:** ${error.message}`);
        }
    },
};
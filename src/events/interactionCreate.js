const { Events } = require('discord.js');
const musicPlayer = require('../services/musicPlayer');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        // Handle button interactions
        if (interaction.isButton()) {
            await handleButtonInteraction(interaction);
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(`Error executing ${interaction.commandName}:`, error);
            
            const errorMessage = {
                content: '❌ There was an error while executing this command!',
                ephemeral: true
            };
            
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(errorMessage);
            } else {
                await interaction.reply(errorMessage);
            }
        }
    },
};

async function handleButtonInteraction(interaction) {
    const customId = interaction.customId;

    try {
        if (customId.startsWith('play_track_')) {
            const userId = customId.split('_')[2];
            
            if (interaction.user.id !== userId) {
                return await interaction.reply({
                    content: '❌ Only the person who requested this music can play it!',
                    ephemeral: true
                });
            }

            const member = interaction.member;
            if (!member.voice.channel) {
                return await interaction.reply({
                    content: '❌ You need to be in a voice channel to play music!',
                    ephemeral: true
                });
            }

            await interaction.deferReply({ ephemeral: true });

            // Extract track info from the embed
            const embed = interaction.message.embeds[0];
            const trackName = embed.title.replace('🎵 ', '').replace(' 🔊', '');
            const artistName = embed.description.split('**')[1];

            const mockTrack = {
                name: trackName,
                artists: [{ name: artistName }]
            };

            const result = await musicPlayer.playTrack(interaction, mockTrack);
            
            if (result.success) {
                await interaction.editReply(`🔊 **Now playing "${trackName}" in ${result.channel}!**`);
            } else {
                await interaction.editReply('❌ Could not play this track. Try again later.');
            }

        } else if (customId.startsWith('stop_music_')) {
            await interaction.deferReply({ ephemeral: true });
            
            await musicPlayer.stop(interaction.guild.id);
            await interaction.editReply('⏹️ **Stopped music and left voice channel.**');
        }

    } catch (error) {
        console.error('Button interaction error:', error);
        
        const errorMessage = {
            content: `❌ **Error:** ${error.message}`,
            ephemeral: true
        };

        if (interaction.deferred) {
            await interaction.editReply(errorMessage);
        } else {
            await interaction.reply(errorMessage);
        }
    }
}
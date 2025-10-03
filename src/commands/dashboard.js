const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dashboard')
        .setDescription('Get a link to your personalized web dashboard'),

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('🌟 Your Personal Dashboard')
            .setDescription('Access your personalized movie and music recommendations on our beautiful web interface!')
            .setColor(0x9B59B6)
            .addFields(
                { name: '🎬 Movies', value: 'Browse curated movie recommendations', inline: true },
                { name: '🎵 Music', value: 'Discover new music tailored to your taste', inline: true },
                { name: '📊 Analytics', value: 'View your recommendation history', inline: true }
            )
            .setFooter({ text: '🎯 Powered by Lahpet • Beautiful design inspired by Awwwards' })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            components: [{
                type: 1,
                components: [{
                    type: 2,
                    style: 5,
                    label: '🚀 Open Dashboard',
                    url: process.env.WEB_URL || `http://localhost:3000/dashboard?user=${interaction.user.id}&username=${encodeURIComponent(interaction.user.username)}`
                }]
            }],
            ephemeral: true
        });
    },
};
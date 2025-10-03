const { Events } = require('discord.js');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        console.log(`🚀 ${client.user.tag} is online and ready!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Connected to ${client.users.cache.size} users`);
        
        // Set bot status
        client.user.setActivity('🎬 Recommending movies & music', { type: 'PLAYING' });
    },
};
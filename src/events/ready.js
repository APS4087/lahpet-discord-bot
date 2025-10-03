const { Events } = require('discord.js');
const { deployGlobalCommands } = require('../utils/commandDeployer');

module.exports = {
    name: Events.ClientReady,
    once: true,
    async execute(client) {
        console.log(`🚀 ${client.user.tag} is online and ready!`);
        console.log(`📊 Serving ${client.guilds.cache.size} servers`);
        console.log(`👥 Connected to ${client.users.cache.size} users`);
        
        // Set bot status
        client.user.setActivity('🎬 Recommending movies & music', { type: 0 }); // 0 = Playing
        
        // Auto-deploy global commands on startup (only if not already deployed)
        try {
            await deployGlobalCommands();
        } catch (error) {
            console.log('⚠️ Commands may already be deployed globally');
        }
    },
};
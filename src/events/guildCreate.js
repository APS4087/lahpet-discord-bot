const { Events } = require('discord.js');
const { deployCommandsToGuild } = require('../utils/commandDeployer');

module.exports = {
    name: Events.GuildCreate,
    execute(guild) {
        console.log(`🎉 Joined new server: ${guild.name} (${guild.id})`);
        console.log(`👥 Server has ${guild.memberCount} members`);
        
        // Automatically deploy commands to the new server
        deployCommandsToGuild(guild.id)
            .then(() => {
                console.log(`✅ Commands deployed to ${guild.name}`);
            })
            .catch(error => {
                console.error(`❌ Failed to deploy commands to ${guild.name}:`, error.message);
            });
    },
};
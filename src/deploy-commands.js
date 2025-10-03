const { REST, Routes } = require('discord.js');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

const commands = [];

// Load all command files
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(path.join(commandsPath, file));
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Deploy commands
(async () => {
    try {
        console.log(`🚀 Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands in the guild with the current set
        let data;
        
        if (process.env.DISCORD_GUILD_ID) {
            // Guild-specific commands (for testing)
            data = await rest.put(
                Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID),
                { body: commands },
            );
            console.log(`✅ Successfully reloaded ${data.length} guild application (/) commands.`);
        } else {
            // Global commands (takes up to 1 hour to update)
            data = await rest.put(
                Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
                { body: commands },
            );
            console.log(`✅ Successfully reloaded ${data.length} global application (/) commands.`);
            console.log('⏰ Note: Global commands may take up to 1 hour to appear in Discord.');
        }
    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();
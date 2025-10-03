const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load all commands
function loadCommands() {
    const commands = [];
    const commandsPath = path.join(__dirname, '..', 'commands');
    
    if (!fs.existsSync(commandsPath)) {
        console.error('❌ Commands directory not found');
        return commands;
    }
    
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        try {
            const filePath = path.join(commandsPath, file);
            const command = require(filePath);
            
            if ('data' in command && 'execute' in command) {
                commands.push(command.data.toJSON());
            } else {
                console.log(`❌ Missing required properties in ${file}`);
            }
        } catch (error) {
            console.error(`❌ Error loading command ${file}:`, error.message);
        }
    }
    
    return commands;
}

// Deploy commands to a specific guild
async function deployCommandsToGuild(guildId) {
    if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
        throw new Error('Missing Discord credentials');
    }

    const commands = loadCommands();
    if (commands.length === 0) {
        throw new Error('No commands to deploy');
    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        console.log(`🚀 Deploying ${commands.length} commands to guild ${guildId}...`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
            { body: commands },
        );

        console.log(`✅ Successfully deployed ${data.length} commands to guild ${guildId}`);
        return data;
    } catch (error) {
        console.error(`❌ Failed to deploy commands to guild ${guildId}:`, error);
        throw error;
    }
}

// Deploy commands globally
async function deployGlobalCommands() {
    if (!process.env.DISCORD_TOKEN || !process.env.DISCORD_CLIENT_ID) {
        throw new Error('Missing Discord credentials');
    }

    const commands = loadCommands();
    if (commands.length === 0) {
        throw new Error('No commands to deploy');
    }

    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    try {
        console.log(`🚀 Deploying ${commands.length} global commands...`);

        const data = await rest.put(
            Routes.applicationCommands(process.env.DISCORD_CLIENT_ID),
            { body: commands },
        );

        console.log(`✅ Successfully deployed ${data.length} global commands`);
        console.log('⏰ Global commands may take up to 1 hour to appear in Discord');
        return data;
    } catch (error) {
        console.error('❌ Failed to deploy global commands:', error);
        throw error;
    }
}

module.exports = {
    deployCommandsToGuild,
    deployGlobalCommands,
    loadCommands
};
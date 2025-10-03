// Quick guild command deployment for immediate testing
require('dotenv').config();
const { REST, Routes } = require('discord.js');
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

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Get guild ID from command line argument
const guildId = process.argv[2];

if (!guildId) {
    console.log('Usage: node src/deploy-guild-commands.js <GUILD_ID>');
    console.log('To get your guild ID: Right-click your server in Discord → Copy Server ID');
    console.log('(Make sure Developer Mode is enabled in Discord settings)');
    process.exit(1);
}

(async () => {
    try {
        console.log(`🚀 Deploying ${commands.length} commands to guild ${guildId}...`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
            { body: commands },
        );

        console.log(`✅ Successfully deployed ${data.length} guild commands!`);
        console.log('Commands should be available immediately in your Discord server.');
    } catch (error) {
        console.error('❌ Error deploying guild commands:', error);
    }
})();
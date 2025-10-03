require('dotenv').config();
const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

const commands = [];
const commandsPath = path.join(__dirname, 'src', 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Load all commands
for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
        console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
        console.log(`❌ Missing required properties in ${file}`);
    }
}

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// Get guild ID from command line argument
const guildId = process.argv[2];

if (!guildId) {
    console.log('❌ Please provide a guild ID:');
    console.log('📋 Usage: node deploy-guild-commands.js YOUR_GUILD_ID');
    console.log('🔍 To find your guild ID:');
    console.log('   1. Enable Developer Mode in Discord');
    console.log('   2. Right-click your server name');
    console.log('   3. Click "Copy Server ID"');
    process.exit(1);
}

(async () => {
    try {
        console.log(`🚀 Started deploying ${commands.length} application (/) commands to guild ${guildId}.`);

        const data = await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, guildId),
            { body: commands },
        );

        console.log(`✅ Successfully deployed ${data.length} application (/) commands to guild!`);
        console.log('🎉 Commands are now available instantly in your server!');
        
        console.log('\n📋 Available commands:');
        data.forEach(cmd => {
            console.log(`   /${cmd.name} - ${cmd.description}`);
        });

    } catch (error) {
        console.error('❌ Error deploying commands:', error);
    }
})();
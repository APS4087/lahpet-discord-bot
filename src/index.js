require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Initialize Discord client with better configuration
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ],
    rest: {
        timeout: 30000, // 30 seconds timeout
        retries: 3
    },
    ws: {
        large_threshold: 50,
        compress: false
    }
});

// Create commands collection
client.commands = new Collection();

// Make client globally available for health checks
global.discordClient = client;

// Load commands
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);
        } else {
            console.log(`⚠️ Command at ${filePath} is missing required "data" or "execute" property.`);
        }
    }
}

// Load event handlers
const eventsPath = path.join(__dirname, 'events');
if (fs.existsSync(eventsPath)) {
    const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args));
        } else {
            client.on(event.name, (...args) => event.execute(...args));
        }
        console.log(`✅ Loaded event: ${event.name}`);
    }
}

// Add reconnection logic
client.on('disconnect', () => {
    console.log('🔌 Discord disconnected, attempting to reconnect...');
    setTimeout(() => connectToDiscord(), 5000);
});

client.on('error', (error) => {
    console.error('Discord client error:', error.message);
});

// Error handling
process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error.message);
    // Don't exit on rejection - keep web server running
});

process.on('uncaughtException', error => {
    console.error('Uncaught exception:', error.message);
    // Only exit on critical errors, not network issues
    if (!error.message.includes('Connect Timeout') && !error.message.includes('ENOTFOUND')) {
        process.exit(1);
    }
});

// Start web server only if not already started
if (!global.webServerStarted) {
    console.log('🌐 Starting web server...');
    const webServer = require('./web/server');
    console.log('✅ Web server started successfully');
    global.webServerStarted = true;
} else {
    console.log('✅ Web server already running, Discord bot connecting...');
}

// Login to Discord with retry logic
if (!process.env.DISCORD_TOKEN) {
    console.error('❌ DISCORD_TOKEN is required!');
    process.exit(1);
}

async function connectToDiscord(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(`🔄 Attempting Discord connection... (${i + 1}/${retries})`);
            await client.login(process.env.DISCORD_TOKEN);
            console.log('✅ Successfully connected to Discord!');
            return;
        } catch (error) {
            console.error(`❌ Discord connection attempt ${i + 1} failed:`, error.message);
            
            if (i === retries - 1) {
                console.error('❌ All Discord connection attempts failed');
                // Don't exit - keep web server running
                console.log('🌐 Continuing with web server only...');
                return;
            }
            
            // Wait before retry (exponential backoff)
            const delay = Math.pow(2, i) * 5000; // 5s, 10s, 20s
            console.log(`⏳ Retrying in ${delay/1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
}

// Start connection process
connectToDiscord();
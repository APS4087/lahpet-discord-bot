#!/usr/bin/env node

// Enhanced error handling
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

// Startup validation
console.log('🚀 Starting Lahpet Discord Bot...');
console.log('📦 Node.js version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || '3000');

// Load environment variables
require('dotenv').config();

// Check required environment variables
const required = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('📝 Please check your environment configuration');
    console.error('🔍 Available env vars:', Object.keys(process.env).filter(k => k.startsWith('DISCORD')));
    process.exit(1);
}

console.log('✅ Environment validation passed');
console.log('🎮 Starting bot...');

// Start the main application with error catching
try {
    require('./index.js');
} catch (error) {
    console.error('❌ Failed to start application:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
}
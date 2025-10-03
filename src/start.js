#!/usr/bin/env node

// Startup validation
console.log('🚀 Starting Lahpet Discord Bot...');
console.log('📦 Node.js version:', process.version);
console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
console.log('🔌 Port:', process.env.PORT || '3000');

// Check required environment variables
const required = ['DISCORD_TOKEN', 'DISCORD_CLIENT_ID'];
const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing.join(', '));
    console.error('📝 Please check your environment configuration');
    process.exit(1);
}

console.log('✅ Environment validation passed');
console.log('🎮 Starting bot...');

// Start the main application
require('./index.js');
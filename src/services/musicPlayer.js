const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection
} = require('@discordjs/voice');
const { PermissionFlagsBits } = require('discord.js');
const play = require('play-dl');
const ytdl = require('ytdl-core');

class MusicPlayer {
    constructor() {
        this.connections = new Map(); // Guild ID -> Connection
        this.players = new Map(); // Guild ID -> Player
        this.queues = new Map(); // Guild ID -> Queue
    }

    async joinChannel(interaction) {
        const member = interaction.member;
        const voiceChannel = member.voice.channel;

        if (!voiceChannel) {
            throw new Error('You need to be in a voice channel to play music!');
        }

        const permissions = voiceChannel.permissionsFor(interaction.client.user);
        if (!permissions.has(PermissionFlagsBits.Connect) || !permissions.has(PermissionFlagsBits.Speak)) {
            throw new Error('I need permissions to join and speak in your voice channel!');
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: false,
        });

        const player = createAudioPlayer();
        connection.subscribe(player);

        // Handle connection events
        connection.on(VoiceConnectionStatus.Ready, () => {
            console.log('🔊 Voice connection is ready!');
        });

        connection.on(VoiceConnectionStatus.Disconnected, async () => {
            console.log('🔌 Voice connection disconnected');
            this.connections.delete(interaction.guild.id);
            this.players.delete(interaction.guild.id);
        });

        connection.on('error', error => {
            console.error('Voice connection error:', error);
        });

        this.connections.set(interaction.guild.id, connection);
        this.players.set(interaction.guild.id, player);

        return { connection, player, voiceChannel };
    }

    async playTrack(interaction, track) {
        try {
            const { player, voiceChannel } = await this.joinChannel(interaction);

            // Search for the track on YouTube using play-dl
            const searchQuery = `${track.name} ${track.artists?.[0]?.name || ''}`;
            
            console.log(`🔍 Searching for: ${searchQuery}`);

            try {
                // Set source to YouTube
                await play.setToken({
                    youtube: {
                        cookie: process.env.YOUTUBE_COOKIE || ''
                    }
                });

                const searched = await play.search(searchQuery, { 
                    limit: 1,
                    source: { youtube: 'video' }
                });

                if (searched.length > 0) {
                    console.log(`✅ Found: ${searched[0].title}`);
                    
                    const stream = await play.stream(searched[0].url, {
                        quality: 2 // Higher quality
                    });

                    const resource = createAudioResource(stream.stream, {
                        inputType: stream.type
                    });
                    
                    player.play(resource);
                    
                    // Handle player events
                    player.on(AudioPlayerStatus.Playing, () => {
                        console.log('🎵 Audio player is now playing');
                    });

                    player.on(AudioPlayerStatus.Idle, () => {
                        console.log('⏸️ Audio player is now idle');
                    });

                    player.on('error', error => {
                        console.error('Audio player error:', error);
                    });
                    
                    return {
                        success: true,
                        track: {
                            title: searched[0].title,
                            url: searched[0].url,
                            duration: searched[0].durationInSec
                        },
                        channel: voiceChannel.name
                    };
                } else {
                    throw new Error('No search results found');
                }

            } catch (searchError) {
                console.error('Search error:', searchError);
                throw new Error(`Could not find "${searchQuery}". Try a different search term.`);
            }

        } catch (error) {
            console.error('Music player error:', error);
            throw error;
        }
    }

    async stop(guildId) {
        const player = this.players.get(guildId);
        const connection = this.connections.get(guildId);

        if (player) {
            player.stop();
            this.players.delete(guildId);
        }

        if (connection) {
            connection.destroy();
            this.connections.delete(guildId);
        }
    }

    async leave(guildId) {
        await this.stop(guildId);
        this.queues.delete(guildId);
    }

    isPlaying(guildId) {
        const player = this.players.get(guildId);
        return player && player.state.status === AudioPlayerStatus.Playing;
    }
}

// Export singleton instance
module.exports = new MusicPlayer();
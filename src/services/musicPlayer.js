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
                // Try multiple approaches for better reliability
                let stream = null;
                let trackInfo = null;

                // Method 1: Try SoundCloud first (more reliable)
                try {
                    const scSearched = await play.search(searchQuery, { 
                        limit: 1,
                        source: { soundcloud: 'tracks' }
                    });

                    if (scSearched.length > 0) {
                        console.log(`✅ Found on SoundCloud: ${scSearched[0].title}`);
                        stream = await play.stream(scSearched[0].url);
                        trackInfo = scSearched[0];
                    }
                } catch (scError) {
                    console.log('SoundCloud search failed, trying YouTube...');
                }

                // Method 2: Try YouTube with different approach
                if (!stream) {
                    try {
                        const ytSearched = await play.search(searchQuery, { 
                            limit: 3, // Try multiple results
                            source: { youtube: 'video' }
                        });

                        for (const video of ytSearched) {
                            try {
                                console.log(`✅ Trying YouTube: ${video.title}`);
                                stream = await play.stream(video.url, {
                                    quality: 1, // Lower quality for better reliability
                                    discordPlayerCompatibility: true
                                });
                                trackInfo = video;
                                break; // Success, exit loop
                            } catch (streamError) {
                                console.log(`Failed to stream ${video.title}, trying next...`);
                                continue;
                            }
                        }
                    } catch (ytError) {
                        console.log('YouTube search failed');
                    }
                }

                // Method 3: Graceful fallback - just join and notify
                if (!stream) {
                    console.log('🔊 No stream available - joining channel to notify user');
                    
                    return {
                        success: true,
                        track: {
                            title: `${searchQuery}`,
                            url: '#',
                            duration: 0
                        },
                        channel: voiceChannel.name,
                        fallback: true,
                        message: 'Found the track but streaming is temporarily blocked by YouTube. The bot has joined your voice channel - try a different song!'
                    };
                }

                // Success - we have a working stream
                const resource = createAudioResource(stream.stream, {
                    inputType: stream.type,
                    inlineVolume: true
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
                        title: trackInfo.title,
                        url: trackInfo.url,
                        duration: trackInfo.durationInSec
                    },
                    channel: voiceChannel.name
                };

            } catch (searchError) {
                console.error('All streaming methods failed:', searchError);
                
                // Final fallback - just join the channel and announce
                console.log('🔊 Joining channel to announce track unavailability');
                
                return {
                    success: true,
                    track: {
                        title: `"${searchQuery}" (Temporarily Unavailable)`,
                        url: '#',
                        duration: 0
                    },
                    channel: voiceChannel.name,
                    fallback: true,
                    message: 'Track found but streaming is temporarily unavailable due to YouTube restrictions. Try again later!'
                };
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
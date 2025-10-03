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
const ytsr = require('youtube-sr').default;
const ytSearch = require('yt-search');
const youtubedl = require('youtube-dl-exec');

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
            const searchQuery = `${track.name} ${track.artists?.[0]?.name || ''}`;
            
            console.log(`🔍 Multi-source search for: ${searchQuery}`);

            // Try all available sources in order of reliability
            const sources = [
                { name: 'SoundCloud', method: () => this.tryPlayDL(searchQuery, 'soundcloud') },
                { name: 'YouTube (play-dl)', method: () => this.tryPlayDL(searchQuery, 'youtube') },
                { name: 'YouTube (ytdl-core)', method: () => this.tryYTDL(searchQuery) },
                { name: 'YouTube (youtube-sr)', method: () => this.tryYoutubeSR(searchQuery) },
                { name: 'YouTube (yt-search)', method: () => this.tryYTSearch(searchQuery) },
                { name: 'YouTube (youtube-dl)', method: () => this.tryYoutubeDL(searchQuery) }
            ];

            let stream = null;
            let trackInfo = null;
            let sourceUsed = null;

            // Try each source until one works
            for (const source of sources) {
                try {
                    console.log(`🔄 Trying ${source.name}...`);
                    const result = await source.method();
                    if (result) {
                        stream = result.stream;
                        trackInfo = result.info;
                        sourceUsed = source.name;
                        console.log(`✅ Success with ${source.name}: ${trackInfo.title}`);
                        break;
                    }
                } catch (error) {
                    console.log(`❌ ${source.name} failed: ${error.message}`);
                    continue;
                }
            }

            // If no stream found, graceful fallback
            if (!stream || !trackInfo) {
                console.log('🔊 All sources failed - joining channel with notification');
                return {
                    success: true,
                    track: {
                        title: `${searchQuery} (Not Available)`,
                        url: '#',
                        duration: 0
                    },
                    channel: voiceChannel.name,
                    fallback: true,
                    message: `Could not stream "${searchQuery}" from any source. Try a different song or check back later!`
                };
            }

            // Create audio resource and play
            const resource = createAudioResource(stream, {
                inputType: trackInfo.inputType || 'webm/opus',
                inlineVolume: true
            });
            
            player.play(resource);
            
            // Handle player events
            player.removeAllListeners(); // Clear old listeners
            player.on(AudioPlayerStatus.Playing, () => {
                console.log(`🎵 Now playing from ${sourceUsed}: ${trackInfo.title}`);
            });

            player.on(AudioPlayerStatus.Idle, () => {
                console.log('⏸️ Playback finished');
            });

            player.on('error', error => {
                console.error('Audio player error:', error);
            });
            
            return {
                success: true,
                track: {
                    title: trackInfo.title,
                    url: trackInfo.url,
                    duration: trackInfo.duration || 0,
                    source: sourceUsed
                },
                channel: voiceChannel.name
            };

        } catch (error) {
            console.error('Music player error:', error);
            throw error;
        }
    }

    // Method 1: play-dl (SoundCloud/YouTube)
    async tryPlayDL(query, source) {
        try {
            const searchOptions = source === 'soundcloud' 
                ? { limit: 2, source: { soundcloud: 'tracks' } }
                : { limit: 3, source: { youtube: 'video' } };

            const results = await play.search(query, searchOptions);
            
            for (const result of results) {
                try {
                    const stream = await play.stream(result.url, {
                        quality: source === 'soundcloud' ? 2 : 1,
                        discordPlayerCompatibility: true
                    });
                    
                    return {
                        stream: stream.stream,
                        info: {
                            title: result.title,
                            url: result.url,
                            duration: result.durationInSec,
                            inputType: stream.type
                        }
                    };
                } catch (streamError) {
                    continue; // Try next result
                }
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Method 2: ytdl-core
    async tryYTDL(query) {
        try {
            const searchResults = await ytSearch(query);
            if (!searchResults.videos.length) return null;

            const video = searchResults.videos[0];
            const info = await ytdl.getInfo(video.videoId);
            
            const stream = ytdl(video.videoId, {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 62,
                liveBuffer: 1 << 62,
                dlChunkSize: 0,
                bitrate: 128
            });

            return {
                stream,
                info: {
                    title: info.videoDetails.title,
                    url: info.videoDetails.video_url,
                    duration: parseInt(info.videoDetails.lengthSeconds),
                    inputType: 'webm/opus'
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Method 3: youtube-sr
    async tryYoutubeSR(query) {
        try {
            const results = await ytsr.search(query, { limit: 3 });
            if (!results.length) return null;

            for (const video of results) {
                try {
                    const stream = ytdl(video.id, {
                        filter: 'audioonly',
                        quality: 'highestaudio'
                    });

                    return {
                        stream,
                        info: {
                            title: video.title,
                            url: video.url,
                            duration: video.duration,
                            inputType: 'webm/opus'
                        }
                    };
                } catch (streamError) {
                    continue;
                }
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    // Method 4: yt-search
    async tryYTSearch(query) {
        try {
            const results = await ytSearch(query);
            if (!results.videos.length) return null;

            const video = results.videos[0];
            const stream = ytdl(video.videoId, {
                filter: 'audioonly',
                quality: 'highestaudio'
            });

            return {
                stream,
                info: {
                    title: video.title,
                    url: video.url,
                    duration: video.duration.seconds,
                    inputType: 'webm/opus'
                }
            };
        } catch (error) {
            throw error;
        }
    }

    // Method 5: youtube-dl-exec (last resort)
    async tryYoutubeDL(query) {
        try {
            // This is more complex and slower, so it's last resort
            const searchResults = await ytSearch(query);
            if (!searchResults.videos.length) return null;

            const video = searchResults.videos[0];
            const output = await youtubedl(video.url, {
                dumpSingleJson: true,
                noCheckCertificates: true,
                noWarnings: true,
                preferFreeFormats: true,
                addHeader: ['referer:youtube.com', 'user-agent:googlebot']
            });

            if (output.url) {
                return {
                    stream: output.url, // Direct URL
                    info: {
                        title: output.title,
                        url: video.url,
                        duration: output.duration,
                        inputType: 'arbitrary'
                    }
                };
            }
            return null;
        } catch (error) {
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
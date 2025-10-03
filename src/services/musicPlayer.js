const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource, 
    AudioPlayerStatus,
    VoiceConnectionStatus,
    getVoiceConnection
} = require('@discordjs/voice');
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
        if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
            throw new Error('I need permissions to join and speak in your voice channel!');
        }

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        connection.subscribe(player);

        this.connections.set(interaction.guild.id, connection);
        this.players.set(interaction.guild.id, player);

        return { connection, player, voiceChannel };
    }

    async playTrack(interaction, track) {
        try {
            const { player, voiceChannel } = await this.joinChannel(interaction);

            // Search for the track on YouTube
            const searchQuery = `${track.name} ${track.artists?.[0]?.name || ''}`;
            let audioUrl = null;

            try {
                // Try using play-dl first
                const searched = await play.search(searchQuery, { limit: 1 });
                if (searched.length > 0) {
                    const stream = await play.stream(searched[0].url);
                    const resource = createAudioResource(stream.stream, {
                        inputType: stream.type
                    });
                    
                    player.play(resource);
                    
                    return {
                        success: true,
                        track: searched[0],
                        channel: voiceChannel.name
                    };
                }
            } catch (error) {
                console.log('Play-dl failed, trying ytdl-core...');
            }

            // Fallback to ytdl-core
            try {
                const searchResults = await ytdl.getInfo(`ytsearch:${searchQuery}`);
                if (searchResults) {
                    const stream = ytdl(searchResults.videoDetails.video_url, {
                        filter: 'audioonly',
                        quality: 'highestaudio',
                    });

                    const resource = createAudioResource(stream);
                    player.play(resource);

                    return {
                        success: true,
                        track: {
                            title: searchResults.videoDetails.title,
                            url: searchResults.videoDetails.video_url
                        },
                        channel: voiceChannel.name
                    };
                }
            } catch (error) {
                console.log('YTDL-core also failed');
            }

            throw new Error('Could not find or play this track');

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
function init(client) {
    // https://discord.com/developers/docs/resources/voice#voice-state-object-voice-state-structure
    class VoiceStateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        async toJSON() {
            const raw = this.raw;

            const guild = await client.guilds.cache.get(raw.guild_id); // TODO: bad idea?
            const channel = raw.channel_id ? await client.channels.cache.get(raw.channel_id) : null;
            const user = await client.users.cache.get(raw.user_id);
            const member = await new client.GuildMemberParser(raw.member).toJSON();

            const json = {
                guild,
                channel,
                user,
                member,
                sessionId: raw.session_id,
                deafened: raw.deaf,
                muted: raw.mute,
                selfDeafened: raw.self_deaf,
                selfMuted: raw.self_mute,
                selfStreaming: raw.self_stream,
                selfVideoing: raw.self_video,
                suppressed: raw.suppress,
                requestToSpeakTimestamp: raw.request_to_speak_timestamp
            };

            return json;
        }

        toAPI() {

        }
    }

    return VoiceStateParser;
}

module.exports = init;
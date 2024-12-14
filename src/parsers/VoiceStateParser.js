// TODO

function init(client) {
    // https://discord.com/developers/docs/resources/voice#voice-state-object-voice-state-structure
    class VoiceStateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                userId: raw.user_id,
                channelId: raw.channel_id,
                guildId: raw.guild_id,
                sessionId: raw.session_id
            };

            return json;
        }

        toAPI() {
            const raw = this.raw;
            const json = {};

            return json;
        }
    }

    return VoiceStateParser;
}

module.exports = init;
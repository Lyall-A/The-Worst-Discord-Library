function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#establishing-a-voice-websocket-connection-example-voice-identify-payload
    class VoiceIdentifyParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {};

            // ...

            return json;
        }

        toAPI() {
            const raw = this.raw;
            const json = {
                server_id: raw.guildId,
                user_id: raw.userId,
                session_id: raw.sessionId,
                token: raw.token,
            };

            return json;
        }
    }

    return VoiceIdentifyParser;
}

module.exports = init;
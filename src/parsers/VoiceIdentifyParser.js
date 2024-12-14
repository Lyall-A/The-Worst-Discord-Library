function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#establishing-a-voice-websocket-connection-example-voice-identify-payload
    class VoiceIdentifyParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {

        }

        toAPI() {
            const raw = this.raw;
            const json = {
                server_id: raw.guild.id,
                user_id: raw.user.id,
                session_id: raw.sessionId,
                token: raw.token,
            };

            return json;
        }
    }

    return VoiceIdentifyParser;
}

module.exports = init;
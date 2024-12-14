// TODO

function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#establishing-a-voice-websocket-connection-example-voice-ready-payload
    class VoiceReadyParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                ssrc: raw.ssrc,
                address: raw.ip,
                port: raw.port,
                modes: raw.modes,
                // heartbeatInterval: raw.heartbeat_interval
            };

            return json;
        }

        toAPI() {

        }
    }

    return VoiceReadyParser;
}

module.exports = init;
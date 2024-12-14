const constants = require("../constants");

function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#establishing-a-voice-udp-connection-example-select-protocol-payload
    class SelectProtocolParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {

        }

        toAPI() {
            const raw = this.raw;
            const json = {
                protocol: raw.protocol ?? "udp",
                data: {
                    address: raw.address,
                    port: raw.port,
                    mode: raw.mode ?? constants.defaultVoiceMode
                }
            };

            return json;
        }
    }

    return SelectProtocolParser;
}

module.exports = init;
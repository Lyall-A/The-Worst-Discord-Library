// TODO

function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#transport-encryption-modes-example-session-description-payload
    class SessionDescriptionParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                mode: raw.mode,
                secretKey: Buffer.from(raw.secret_key)
            };

            return json;
        }

        toAPI() {

        }
    }

    return SessionDescriptionParser;
}

module.exports = init;
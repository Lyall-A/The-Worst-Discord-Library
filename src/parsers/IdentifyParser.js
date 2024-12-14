const { intentParser } = require("../utils");

function init(client) {
    // https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
    class IdentifyParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {

        }

        toAPI() {
            const raw = this.raw;
            const json = {
                token: raw.token ?? "",
                properties: raw.properties ?? {},
                intents: intentParser.objToInt(raw.intents ?? []) ?? 0
            };

            return json;
        }
    }

    return IdentifyParser;
}

module.exports = init;
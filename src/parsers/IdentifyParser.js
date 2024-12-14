const intentParser = require("../utils/intentParser");

function init(client) {
    // https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
    class IdentifyParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                token: raw.token ?? "",
                properties: raw.properties ?? {},
                intents: intentParser.intToObj(raw.intents) ?? 0
            };

            return json;
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
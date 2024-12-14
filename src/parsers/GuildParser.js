// TODO

function init(client) {
    // https://discord.com/developers/docs/resources/guild#guild-object-guild-structure
    class GuildParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        /**
         * Parse into JSON used for client
         */
        toJSON() {
            const raw = this.raw;
            const json = {
                id: raw.id,
                name: raw.name
            };

            return json;
        }

        /**
         * Parse into JSON to be sent to API
         */
        toAPI() {

        }
    }

    return GuildParser;
}

module.exports = init;
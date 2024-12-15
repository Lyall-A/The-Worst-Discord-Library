// TODO

function init(client) {
    // https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure
    class TemplateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        /**
         * Parse into JSON used for client
         */
        async toJSON() {
            const raw = this.raw;
            const json = {
                nickname: raw.nick,
                user: await new client.UserParser(raw.user).toJSON()
            };

            return json;
        }

        /**
         * Parse into JSON to be sent to API
         */
        toAPI() {

        }
    }

    return TemplateParser;
}

module.exports = init;
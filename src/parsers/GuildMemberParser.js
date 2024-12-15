// TODO

function init(client) {
    // https://discord.com/developers/docs/resources/guild#guild-member-object-guild-member-structure
    class GuildMemberParser {
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
                user: raw.user ? await new client.UserParser(raw.user).toJSON() : null
            };

            return json;
        }

        /**
         * Parse into JSON to be sent to API
         */
        toAPI() {

        }
    }

    return GuildMemberParser;
}

module.exports = init;
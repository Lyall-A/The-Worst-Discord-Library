// TODO

function init(client) {
    // https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
    class UserParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                username: raw.username,
                id: raw.id,
                globalName: raw.global_name,
                discriminator: raw.discriminator,
                bot: raw.bot
            };

            return json;
        }

        toAPI() {

        }
    }

    return UserParser;
}

module.exports = init;
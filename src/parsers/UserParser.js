// TODO

function init(client) {
    // https://discord.com/developers/docs/resources/user#user-object-user-structure
    class UserParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                id: raw.id,
                username: raw.username,
                discriminator: raw.discriminator === "0" ? null : raw.discriminator,
                globalName: raw.global_name,
                bot: raw.bot ?? false
            };

            return json;
        }

        toAPI() {

        }
    }

    return UserParser;
}

module.exports = init;
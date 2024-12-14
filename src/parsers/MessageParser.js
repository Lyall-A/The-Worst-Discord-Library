function init(client) {
    // https://discord.com/developers/docs/resources/message#message-object-message-structure
    class MessageParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                id: raw.id,
                channelId: raw.id,
                content: raw.content
            };

            return json;
        }

        toAPI() {
            const raw = this.raw;
            const json = {};

            // ...

            return json;
        }
    }

    return MessageParser;
}

module.exports = init;
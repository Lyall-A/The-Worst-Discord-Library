function init(client) {
    // https://discord.com/developers/docs/resources/message#message-object-message-structure
    class MessageParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        async toJSON() {
            const raw = this.raw;
            const json = {
                id: raw.id,
                channel: null,
                author: new client.UserParser(raw.author).toJSON(),
                channelId: raw.channel_id,
                content: raw.content
            };
            json.channel = await client.channels.cache.get(raw.channel_id);
            // json.reply = (message) => 

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
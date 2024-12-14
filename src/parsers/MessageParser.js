// TODO

const constants = require("../constants");

function init(client) {
    // https://discord.com/developers/docs/resources/message#message-object-message-structure
    class MessageParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        async toJSON() {
            const raw = this.raw;

            const channel = await client.channels.cache.get(raw.channel_id);

            const json = {
                id: raw.id,
                channel,
                author: await new client.UserParser(raw.author).toJSON(),
                content: raw.content
            };
            json.reply = (content, options = { }) => channel.send(content, { reference: { message: json }, ...(options ?? {}) });

            return json;
        }

        toAPI() {
            const raw = this.raw;
            const json = {
                content: raw.content,
                message_reference: raw.reference ? {
                    type: constants.messageReferenceTypes[raw.reference.type] ?? 0,
                    message_id: raw.reference.message?.id,
                    channel_id: raw.reference.channel?.id,
                    guild_id: raw.reference.guildId,
                    fail_if_not_exists: raw.reference.fail
                } : undefined
            };

            return json;
        }
    }

    return MessageParser;
}

module.exports = init;
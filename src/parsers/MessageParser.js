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

            const guild = await client.guilds.cache.get(raw.guild_id);
            const channel = await client.channels.cache.get(raw.channel_id);
            const author = await new client.UserParser(raw.author).toJSON();
            const member = await guild.members.cache.get(author.id);

            const json = {
                id: raw.id,
                channel,
                guild,
                author,
                member,
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
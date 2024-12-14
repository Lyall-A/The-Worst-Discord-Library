function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#retrieving-voice-server-information-example-voice-server-update-payload
    class VoiceServerUpdateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        async toJSON() {
            const raw = this.raw;

            const guild = await client.guilds.cache.get(raw.guild_id);

            const json = {
                token: raw.token,
                guild,
                endpoint: raw.endpoint,
            };

            return json;
        }

        toAPI() {

        }
    }

    return VoiceServerUpdateParser;
}

module.exports = init;
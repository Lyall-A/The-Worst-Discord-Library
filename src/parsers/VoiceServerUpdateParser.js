// TODO

function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#retrieving-voice-server-information-example-voice-server-update-payload
    class VoiceServerUpdateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                token: raw.token,
                guildId: raw.guild_id,
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
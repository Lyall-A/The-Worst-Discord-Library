// TODO

function init(client) {
    // https://discord.com/developers/docs/events/gateway-events#update-voice-state-example-gateway-voice-state-update
    class VoiceStateUpdateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {};

            return json;
        }

        toAPI() {
            const raw = this.raw;
            const json = {
                guild_id: raw.guildId ?? "",
                channel_id: raw.channelId ?? "",
                self_mute: raw.selfMute ?? false,
                self_deaf: raw.selfDeaf ?? false
            };

            return json;
        }
    }

    return VoiceStateUpdateParser;
}

module.exports = init;
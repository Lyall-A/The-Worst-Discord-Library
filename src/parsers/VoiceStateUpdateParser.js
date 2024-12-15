function init(client) {
    // https://discord.com/developers/docs/events/gateway-events#update-voice-state-example-gateway-voice-state-update
    class VoiceStateUpdateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {

        }

        toAPI() {
            const raw = this.raw;
            const json = {
                guild_id: raw.guild?.id,
                channel_id: raw.channel?.id ?? null,
                self_mute: raw.selfMuted ?? false,
                self_deaf: raw.selfDeafened ?? false
            };

            return json;
        }
    }

    return VoiceStateUpdateParser;
}

module.exports = init;
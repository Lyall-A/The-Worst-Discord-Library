function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#speaking-example-speaking-payload
    class SpeakingParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {

        }

        toAPI() {
            const raw = this.raw;
            const json = {
                speaking: raw.speaking === true ? 1 : raw.speaking === false ? 0 : raw.speaking,
                delay: raw.delay ?? 0,
                ssrc: raw.ssrc
            };

            return json;
        }
    }

    return SpeakingParser;
}

module.exports = init;
function init(client) {
    // https://discord.com/developers/...
    class TemplateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {};

            // ...

            return json;
        }

        toAPI() {
            const raw = this.raw;
            const json = {};

            // ...

            return json;
        }
    }

    return TemplateParser;
}

module.exports = init;
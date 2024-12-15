Parsers that are made with client

## Template:
```js
function init(client) {
    // https://discord.com/developers/...
    class TemplateParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        /**
         * Parse into JSON used for client
         */
        async toJSON() {
            const raw = this.raw;
            const json = {};

            // ...

            return json;
        }

        /**
         * Parse into JSON to be sent to API
         */
        async toAPI() {
            const raw = this.raw;
            const json = {};

            // ...

            return json;
        }
    }

    return TemplateParser;
}

module.exports = init;
```
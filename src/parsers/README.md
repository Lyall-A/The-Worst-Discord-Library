cum

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
        toJSON() {
            const raw = this.raw;
            const json = {};

            // ...

            return json;
        }

        /**
         * Parse into JSON to be sent to API
         */
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
```
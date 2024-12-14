function init(client) {
    class Guilds {
        constructor() {
            if (!client.cache.guilds) client.cache.guilds = [];
            this._cache = client.cache.guilds;
        }

        get(example) {
            return {
                id: "asd",
                name: "asdad",
                channels: client.api
            }
        }
    }

    return Guilds;
}

module.exports = init;
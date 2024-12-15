const constants = require("../constants");

function init(client) {
    class Guilds {
        constructor() {
            if (!client._cache.guilds) client._cache.guilds = [];
            this._cache = client._cache.guilds;
        }

        get(guildId) {
            return new Promise((resolve, reject) => {
                client.api(`/guilds/${guildId}`).then(async res => {
                    if (res.status !== 200) return reject(res);

                    const guild = await new client.GuildParser(res.parsed).toJSON();
                    this.cache.add(guild);
                    resolve(guild);
                });
            });
        }

        cache = {
            get: (guildId) => {
                const cached = this.cache.find(guildId);
                if (cached) return cached.data;
                
                return this.get(guildId);
            },
            add: (guild) => {
                const index = this.cache.findIndex(i => i.id === guild.id);
                const cached = {
                    lastUpdated: Date.now(),
                    expireDate: Date.now() + constants.cacheExpiry,
                    _cache: guild._cache,
                    id: guild.id,
                    data: guild
                }
                if (index === null) {
                    this._cache.push(cached);
                } else {
                    this._cache[index] = cached;
                }
            },
            find: (guildId) => {
                return this._cache.find(i => i.id === guildId) ?? null;
            },
            findIndex: (guildId) => {
                const index = this._cache.findIndex(i => i.id === guildId);
                return index < 0 ? null : index;
            }
        }
    }

    return Guilds;
}

module.exports = init;
function init(client) {
    class Guilds {
        constructor() {
            if (!client.cache.guilds) client.cache.guilds = [];
            this._cache = client.cache.guilds;
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
                const cachedGuild = this.cache.find(guildId);
                if (cachedGuild) return cachedGuild;
                
                return this.get(guildId);
            },
            add: (guild) => {
                const index = this.cache.findIndex(i => i.id === guild.id);
                index === null ? this._cache.push(guild) : this._cache[index] = guild;
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
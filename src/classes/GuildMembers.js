const constants = require("../constants");

function init(client) {
    class GuildMembers {
        constructor(guild) {
            if (!guild._cache.members) guild._cache.members = [];
            this._cache = guild._cache.members;
            this.guild = guild;
        }

        get(memberId) {
            return new Promise((resolve, reject) => {
                client.api(`/guilds/${this.guild.id}/members/${memberId}`).then(async res => {
                    if (res.status !== 200) return reject(res);

                    const member = await new client.GuildMemberParser(res.parsed).toJSON();
                    this.cache.add(member);
                    resolve(member);
                });
            });
        }

        cache = {
            get: (memberId) => {
                const cached = this.cache.find(memberId);
                if (cached) return cached.data;
                
                return this.get(memberId);
            },
            add: (member) => {
                const index = this.cache.findIndex(i => i.id === member.id);
                const cached = {
                    lastUpdated: Date.now(),
                    expireDate: Date.now() + constants.cacheExpiry,
                    _cache: member._cache,
                    id: member.id,
                    data: member
                }
                if (index === null) {
                    this._cache.push(cached);
                } else {
                    this._cache[index] = cached;
                }
            },
            find: (memberId) => {
                return this._cache.find(i => i.id === memberId) ?? null;
            },
            findIndex: (memberId) => {
                const index = this._cache.findIndex(i => i.id === memberId);
                return index < 0 ? null : index;
            }
        }
    }

    return GuildMembers;
}

module.exports = init;
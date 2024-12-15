const constants = require("../constants");

function init(client) {
    class Users {
        constructor() {
            if (!client._cache.users) client._cache.users = [];
            this._cache = client._cache.users;
        }

        get(userId) {
            return new Promise((resolve, reject) => {
                client.api(`/users/${userId}`).then(async res => {
                    if (res.status !== 200) return reject(res);

                    const user = await new client.UserParser(res.parsed).toJSON();
                    this.cache.add(user);
                    resolve(user);
                });
            });
        }

        cache = {
            get: (userId) => {
                const cached = this.cache.find(userId);
                if (cached) return cached.data;
                
                return this.get(userId);
            },
            add: (user) => {
                const index = this.cache.findIndex(i => i.id === user.id);
                const cached = {
                    lastUpdated: Date.now(),
                    expireDate: Date.now() + constants.cacheExpiry,
                    _cache: user._cache,
                    id: user.id,
                    data: user
                }
                if (index === null) {
                    this._cache.push(cached);
                } else {
                    this._cache[index] = cached;
                }
            },
            find: (userId) => {
                return this._cache.find(i => i.id === userId) ?? null;
            },
            findIndex: (userId) => {
                const index = this._cache.findIndex(i => i.id === userId);
                return index < 0 ? null : index;
            }
        }
    }

    return Users;
}

module.exports = init;
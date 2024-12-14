function init(client) {
    class Users {
        constructor() {
            if (!client.cache.users) client.cache.users = [];
            this._cache = client.cache.users;
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
                const cachedUser = this.cache.find(userId);
                if (cachedUser) return cachedUser;
                
                return this.get(userId);
            },
            add: (user) => {
                const index = this.cache.findIndex(i => i.id === user.id);
                index === null ? this._cache.push(user) : this._cache[index] = user;
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
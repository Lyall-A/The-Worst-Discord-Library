function init(client) {
    class Users {
        constructor() {
            if (!client.cache.users) client.cache.users = [];
            this._cache = client.cache.users;
        }
    }

    return Users;
}

module.exports = init;
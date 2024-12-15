const constants = require("../constants");

function init(client) {
    class Channels {
        constructor() {
            if (!client._cache.channels) client._cache.channels = [];
            this._cache = client._cache.channels;
        }

        get(channelId) {
            return new Promise((resolve, reject) => {
                client.api(`/channels/${channelId}`).then(async res => {
                    if (res.status !== 200) return reject(res);

                    const channel = await new client.ChannelParser(res.parsed).toJSON();
                    this.cache.add(channel);
                    resolve(channel);
                });
            });
        }

        cache = {
            get: (channelId) => {
                const cached = this.cache.find(channelId);
                if (cached) return cached.data;
                
                return this.get(channelId);
            },
            add: (channel) => {
                const index = this.cache.findIndex(i => i.id === channel.id);
                const cached = {
                    lastUpdated: Date.now(),
                    expireDate: Date.now() + constants.cacheExpiry,
                    _cache: channel._cache,
                    id: channel.id,
                    data: channel
                }
                if (index === null) {
                    this._cache.push(cached);
                } else {
                    this._cache[index] = cached;
                }
            },
            find: (channelId) => {
                return this._cache.find(i => i.id === channelId) ?? null;
            },
            findIndex: (channelId) => {
                const index = this._cache.findIndex(i => i.id === channelId);
                return index < 0 ? null : index;
            }
        }
    }

    return Channels;
}

module.exports = init;
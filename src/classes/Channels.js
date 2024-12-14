function init(client) {
    class Channels {
        constructor() {
            if (!client.cache.channels) client.cache.channels = [];
            this._cache = client.cache.channels;
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
                const cachedChannel = this.cache.find(channelId);
                if (cachedChannel) return cachedChannel;
                
                return this.get(channelId);
            },
            add: (channel) => {
                const index = this.cache.findIndex(i => i.id === channel.id);
                index === null ? this._cache.push(channel) : this._cache[index] = channel;
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
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
                    this._cache.push(channel);
                    resolve(channel);
                });
            });
        }

        cache = {
            get: (channelId) => {
                const cachedChannel = this._cache.find(i => i.id === channelId);
                if (cachedChannel) return cachedChannel;

                return this.get(channelId);
            }
        }
    }

    return Channels;
}

module.exports = init;
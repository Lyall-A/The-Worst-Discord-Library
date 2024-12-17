const constants = require("../constants");

function init(client) {
    class GuildVoiceStates {
        constructor(guild) {
            if (!guild._cache.voiceStates) guild._cache.voiceStates = [];
            this._cache = guild._cache.voiceStates;
            this.guild = guild;
        }

        get(userId) {
            return new Promise((resolve, reject) => {
                client.api(`/guilds/${this.guild.id}/voice-states/${userId}`).then(async res => {
                    if (res.status !== 200) return reject(res);

                    const voiceState = await new client.VoiceStateParser(res.parsed).toJSON();
                    this.cache.add(voiceState);
                    resolve(voiceState);
                });
            });
        }

        cache = {
            get: (userId) => {
                const cached = this.cache.find(userId);
                if (cached) return cached.data;
                
                return this.get(userId);
            },
            add: (voiceState) => {
                const index = this.cache.findIndex(i => i.id === voiceState.id);
                const cached = {
                    lastUpdated: Date.now(),
                    expireDate: Date.now() + constants.cacheExpiry,
                    _cache: voiceState._cache,
                    id: voiceState.user.id,
                    data: voiceState
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

    return GuildVoiceStates;
}

module.exports = init;
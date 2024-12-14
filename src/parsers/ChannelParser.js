// TODO
const constants = require("../constants");
const promiseTimeout = require("../utils/promiseTimeout");

function init(client) {
    // https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
    class ChannelParser {
        constructor(raw = {}) {
            this.raw = raw;
            // this.id = obj.id;
            // this.type = obj.type;
            // this.name = obj.name;
            // this.guild_id = obj.guild_id;
        }

        toJSON() {
            const raw = this.raw;
            const json = {};

            json.id = raw.id ?? "";
            json.type = Object.entries(constants.channelTypes).find(([key, value]) => value === raw.type)?.[0] ?? null;
            json.name = raw.name;
            json.guildId = raw.guild_id;
            json.isVoice = constants.channelVoiceTypes.includes(json.type);
            if (json.isVoice) json.join = (selfMute = false, selfDeaf = false) => {
                return new Promise((resolve, reject) => {
                    let receivedVoiceStateUpdate = false;
                    let receivedVoiceServerUpdate = false;

                    client.gateway.send("VOICE_STATE_UPDATE", new client.VoiceStateUpdateParser({
                        guildId: raw.guild_id,
                        channelId: raw.id,
                        selfDeaf,
                        selfMute
                    }));

                    const stopTimeout = promiseTimeout(reject, "Timed out waiting for VOICE_STATE_UPDATE and VOICE_SERVER_UPDATE event");

                    function voiceStateUpdateEvent(data) {
                        if (data.guildId !== raw.guild_id || data.channelId !== raw.id || data.userId !== client.user.id) return;
                        client.removeListener("VOICE_STATE_UPDATE", voiceStateUpdateEvent);
                        receivedVoiceStateUpdate = data;
                        receivedCheck();
                    }
                    
                    function voiceServerUpdateEvent(data) {
                        if (data.guildId !== raw.guild_id) return;
                        client.removeListener("VOICE_SERVER_UPDATE", voiceServerUpdateEvent);
                        receivedVoiceServerUpdate = data;
                        receivedCheck();
                    }

                    function receivedCheck() {
                        if (!receivedVoiceStateUpdate || !receivedVoiceServerUpdate) return false;
                        stopTimeout();
                        resolve({
                            token: receivedVoiceServerUpdate.token,
                            endpoint: receivedVoiceServerUpdate.endpoint,
                            userId: receivedVoiceStateUpdate.userId,
                            channelId: receivedVoiceStateUpdate.channelId,
                            guildId: receivedVoiceStateUpdate.guildId,
                            sessionId: receivedVoiceStateUpdate.sessionId
                        });
                    }

                    client.addListener("VOICE_STATE_UPDATE", voiceStateUpdateEvent);
                    client.addListener("VOICE_SERVER_UPDATE", voiceServerUpdateEvent);
                });
            }

            return json;
        }

        toAPI() {

        }
    }

    return ChannelParser;
}

module.exports = init;
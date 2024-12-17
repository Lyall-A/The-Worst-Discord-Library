// TODO
const constants = require("../constants");
const { promiseTimeout } = require("../utils");

function init(client) {
    // https://discord.com/developers/docs/resources/channel#channel-object-channel-structure
    class ChannelParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        async toJSON() {
            const raw = this.raw;
            const json = {};

            const guild = await client.guilds.cache.get(raw.guild_id).catch(err => null);

            json.id = raw.id;
            json.type = Object.entries(constants.channelTypes).find(([key, value]) => value === raw.type)?.[0];
            json.name = raw.name;
            json.guild = guild;
            json.isVoice = constants.channelVoiceTypes.includes(json.type);
            json.isText = constants.channelTextTypes.includes(json.type);
            if (json.isVoice) {
                json.join = (selfMuted = false, selfDeafened = false) => {
                    return new Promise((resolve, reject) => {
                        let receivedVoiceStateUpdate = false;
                        let receivedVoiceServerUpdate = false;

                        client.gateway.send("VOICE_STATE_UPDATE", new client.VoiceStateUpdateParser({
                            guild: guild,
                            channel: json,
                            selfDeafened,
                            selfMuted
                        }));

                        const stopTimeout = promiseTimeout(reject, "Timed out waiting for VOICE_STATE_UPDATE and VOICE_SERVER_UPDATE event");

                        function voiceStateUpdateEvent(data) {
                            if (data.guild.id !== raw.guild_id || data.channel.id !== raw.id || data.user.id !== client.user.id) return;
                            client.removeListener("VOICE_STATE_UPDATE", voiceStateUpdateEvent);
                            receivedVoiceStateUpdate = data;
                            receivedCheck();
                        }

                        function voiceServerUpdateEvent(data) {
                            if (data.guild.id !== raw.guild_id) return;
                            client.removeListener("VOICE_SERVER_UPDATE", voiceServerUpdateEvent);
                            receivedVoiceServerUpdate = data;
                            receivedCheck();
                        }

                        function receivedCheck() {
                            if (!receivedVoiceStateUpdate || !receivedVoiceServerUpdate) return false;
                            stopTimeout();
                            // guild.voiceChannel = json;
                            resolve({
                                token: receivedVoiceServerUpdate.token,
                                endpoint: receivedVoiceServerUpdate.endpoint,
                                user: receivedVoiceStateUpdate.user,
                                channel: receivedVoiceStateUpdate.channel,
                                guild: receivedVoiceStateUpdate.guild,
                                sessionId: receivedVoiceStateUpdate.sessionId
                            });
                        }

                        client.addListener("VOICE_STATE_UPDATE", voiceStateUpdateEvent);
                        client.addListener("VOICE_SERVER_UPDATE", voiceServerUpdateEvent);
                    });
                }
                json.leave = () => {
                    return new Promise((resolve, reject) => {
                        if (guild.voice?.id !== raw.id) return resolve();
                        client.gateway.send("VOICE_STATE_UPDATE", new client.VoiceStateUpdateParser({
                            guild
                        }));

                        const stopTimeout = promiseTimeout(reject, "Timed out waiting for VOICE_STATE_UPDATE event");

                        function voiceStateUpdateEvent(data) {
                            if (data.guild.id !== raw.guild_id || data.user.id !== client.user.id) return;
                            client.removeListener("VOICE_STATE_UPDATE", voiceStateUpdateEvent);
                            stopTimeout();
                            // guild.voiceChannel = null;
                            resolve();
                        }

                        client.addListener("VOICE_STATE_UPDATE", voiceStateUpdateEvent);
                    });
                }
            }
            if (json.isText) {
                json.send = async (content, options = {}) => {
                    return client.api(`/channels/${raw.id}/messages`, {
                        method: "POST",
                        json: await new client.MessageParser({ content, ...(options ?? {}) }).toAPI()
                    });
                }
            }

            return json;
        }

        toAPI() {

        }
    }

    return ChannelParser;
}

module.exports = init;
async function parseEvent(event, data, client) {
    if (event === "READY") return await new client.ReadyParser(data).toJSON();
    if (event === "VOICE_SERVER_UPDATE") return await new client.VoiceServerUpdateParser(data).toJSON();
    if (event === "VOICE_STATE_UPDATE") return await new client.VoiceStateParser(data).toJSON();
    if (event === "MESSAGE_CREATE") return await new client.MessageParser(data).toJSON();
}

module.exports = parseEvent;
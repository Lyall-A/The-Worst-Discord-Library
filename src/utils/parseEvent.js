function parseEvent(event, data, client) {
    if (event === "READY") return new client.ReadyParser(data).toJSON();
    if (event === "VOICE_SERVER_UPDATE") return new client.VoiceServerUpdateParser(data).toJSON();
    if (event === "VOICE_STATE_UPDATE") return new client.VoiceStateUpdateParser(data).toJSON();
}

module.exports = parseEvent;
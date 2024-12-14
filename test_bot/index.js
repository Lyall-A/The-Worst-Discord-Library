const { Client, constants } = require("../src");
const createOpus = require("../src/utils/createOpus");
const createVoicePacket = require("../src/utils/createVoicePacket");

const client = new Client({ intents: ["GUILDS", "MESSAGE_CONTENT", "GUILD_VOICE_STATES"] });

client.on("READY", async event => {
    console.log(`Ready as ${client.user.username}`);

    // gets voice channel
    const channel = await client.channels.get(process.env.CHANNEL_ID);

    // joins voice channel
    const voiceConnection = await channel.join();

    // connects to gateway for voice channel
    const voiceGateway = new client.VoiceGateway({
        endpoint: voiceConnection.endpoint
    });
    await voiceGateway.connect();

    // identifies to voice gateway
    const identify = await voiceGateway.identify({
        guildId: voiceConnection.guildId,
        userId: voiceConnection.userId,
        sessionId: voiceConnection.sessionId,
        token: voiceConnection.token
    });

    // connects to udp
    const voiceUDP = new client.VoiceUDP({
        address: identify.address,
        port: identify.port,
        ssrc: identify.ssrc
    });
    voiceUDP.connect();

    // perform ip discovery 
    const ipDiscovery = await voiceUDP.performIPDiscovery();

    // select protocol for vc
    const protocol = await voiceGateway.selectProtocol({
        address: ipDiscovery.address,
        port: ipDiscovery.port,
        ssrc: identify.ssrc
    });

    // just stuff inni
    const queue = [];
    let nonce = 0;
    let timestamp = 0;
    let sequence = 0;

    // set speaking in vc
    voiceGateway.speaking({ speaking: true });

    // turn input into opus segments with ffmpeg and push to queue
    const opus = createOpus(process.env.TRACK_INPUT);
    opus.on("segment", segment => {
        queue.push(segment);
        if (queue.length === 1) sendQueue();
    });

    // send queue
    let time = null;
    function sendQueue() {
        const data = queue[0];
        if (!data) return;

        if (time === null) time = Date.now();
        time += 20;

        // create packet
        const packet = createVoicePacket(data, protocol.mode, protocol.secretKey, nonce, sequence, timestamp, identify.ssrc);

        // increment shit
        nonce++;
        timestamp += constants.voiceTimestampIncrement;
        sequence++;

        // send packet
        voiceUDP.send(packet, () => {
            // send queue again if still data in queue
            queue.shift();
            if (queue.length) setTimeout(sendQueue, time - Date.now());
        });
    }
});

client.login(process.env.DISCORD_TOKEN);
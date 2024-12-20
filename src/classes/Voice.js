const { createOpus, createVoicePacket, EventHandler } = require("../utils");
const constants = require("../constants");

function init(client) {
    class Voice {
        constructor(channel) {
            this.channel = channel;
            this.eventHandler = new EventHandler(this);
        }

        speaking = false;
        playing = false;
        stopping = false;
        stopped = true;
        building = false;
        joined = false;
        voiceGatewayConnected = false;
        voiceGatewayIdentified = false;
        voiceUDPConnected = false;
        performedIPDiscovery = false;
        protocolSelected = false;
        queue = [];
        duration = 0;
        nonce = 0;
        timestamp = 0;
        sequence = 0;
        args = { };
        nextPacketTime = null;
        silenceFrame = [248, 255, 254];

        join() {
            if (!this.channel.isVoice) throw new Error(`Not a voice channel`);
            return this.channel.join().then(({ token, endpoint, user, channel, guild, sessionId }) => {
                this.token = token;
                this.endpoint = endpoint;
                this.user = user;
                this.channel = channel;
                this.guild = guild;
                this.sessionId = sessionId;

                this.joined = true;
            });
        }

        connectVoiceGateway() {
            this.voiceGateway = new client.VoiceGateway({
                endpoint: this.endpoint
            });
            return this.voiceGateway.connect().then(() => {
                this.voiceGatewayConnected = true;
            });
        }

        identifyVoiceGateway() {
            return this.voiceGateway.identify({
                guild: this.guild,
                user: this.user,
                sessionId: this.sessionId,
                token: this.token
            }).then(({ ssrc, address, port, modes }) => {
                this.ssrc = ssrc;
                this.address = address;
                this.port = port;
                this.modes = modes;

                this.voiceGatewayIdentified = true;
            });
        }

        connectVoiceUDP() {
            this.voiceUDP = new client.VoiceUDP({
                address: this.address,
                port: this.port,
                ssrc: this.ssrc
            });
            this.voiceUDPConnected = true;
            return this.voiceUDP.connect();
        }

        performIPDiscovery() {
            return this.voiceUDP.performIPDiscovery().then(({ address, port }) => {
                this.externalAddress = address;
                this.externalPort = port;

                this.performedIPDiscovery = true;
            });
        }

        selectProtocol() {
            return this.voiceGateway.selectProtocol({
                address: this.externalAddress,
                port: this.externalPort,
                ssrc: this.ssrc
            }).then(({ mode, secretKey }) => {
                this.mode = mode;
                this.secretKey = secretKey;

                this.protocolSelected = true;
            });
        }

        setSpeaking(speaking) {
            if (speaking === this.speaking);
            this.speaking = speaking ? true : false;
            return this.voiceGateway.speaking({ speaking: this.speaking })
        }

        setArgs(start, end) {
            if (start) this.args.start = start;
            if (end) this.args.end = end;
        }

        prepare() {
            return new Promise(async (resolve, reject) => {
                if (!this.joined) await this.join().catch(err => reject(err));
                if (!this.voiceGatewayConnected) await this.connectVoiceGateway().catch(err => reject(err));
                if (!this.voiceGatewayIdentified) await this.identifyVoiceGateway().catch(err => reject(err));
                if (!this.voiceUDPConnected) await this.connectVoiceUDP();
                if (!this.performedIPDiscovery) await this.performIPDiscovery().catch(err => reject(err));
                if (!this.protocolSelected) await this.selectProtocol().catch(err => reject(err));

                resolve();
            });
        }

        play(input) {
            this.input = input;
            this.stopped = false;
            this.building = true;
            this.playing = true;
            this.duration = 0;
            this.call("playing");
            this.call("building");

            this.setSpeaking(true);

            this.opus = createOpus(input, this.args);
            this.opus.on("data", data => this.call("data", data));
            this.opus.on("segment", segment => {
                if (this.stopped || this.stopping) return;
                this.queue.push(segment);
                if (this.queue.length <= 1) this.sendQueue();
            });
            this.opus.on("close", () => {
                this.building = false;
            });
        }

        async stop() {
            if (this.stopped || this.stopping) return;
            this.call("stopping");
            this.stopping = true;
            if (this.building) this.opus.kill();

            this.queue = [];
            this.nextPacketTime = null;

            await this.sendSilenceFrames();
            this.setSpeaking(false);

            this.stopping = false;
            this.stopped = true;
            this.call("stopped");
        }

        sendQueue() {
            const opusData = this.queue[0];
            if (!opusData || this.stopping || this.stopped) return;

            if (this.nextPacketTime === null) this.nextPacketTime = Date.now();
            this.nextPacketTime += 20;

            this.sendOpusData(opusData).then(() => {
                this.queue.shift();
                const timeout = this.nextPacketTime - Date.now();
                if (this.queue.length) setTimeout(() => this.sendQueue(), timeout);
            });
        }

        sendSilenceFrames() {
            return new Promise((resolve, reject) => {
                let nextPacketTime = null;
                
                const sendSilenceFrame = async (count = 0) => {
                    if (nextPacketTime === null) nextPacketTime = Date.now();
                    nextPacketTime += 20;

                    if (count >= 5) return resolve();
                    await this.sendOpusData(this.silenceFrame);
                    const timeout = nextPacketTime - Date.now();
                    setTimeout(() => sendSilenceFrame(count + 1), timeout);
                };
                sendSilenceFrame();
            });
        }

        sendOpusData(opusData) {
            return new Promise((resolve, reject) => {
                const packet = createVoicePacket(opusData, this.mode, this.secretKey, this.nonce, this.sequence, this.timestamp, this.ssrc);

                this.voiceUDP.send(packet, err => {
                    if (err) reject(err);
                    this.nonce++;
                    this.timestamp += constants.voiceTimestampIncrement;
                    this.sequence++;
                    this.duration += 20;
                    if (this.nonce >= constants.voiceNonceMax) this.nonce = 0;
                    if (this.timestamp >= constants.voiceTimestampMax) this.timestamp = 0;
                    if (this.sequence >= constants.voiceSequenceMax) this.sequence = 0;
                    resolve();
                });
            });
        }
    }

    return Voice;
}

module.exports = init;
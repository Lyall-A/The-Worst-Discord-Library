const constants = require("../constants");
const imports = require("../imports");
const { promiseTimeout, EventHandler } = require("../utils");

function init(client) {
    // https://discord.com/developers/docs/topics/voice-connections#establishing-a-voice-websocket-connection
    class VoiceGateway {
        constructor(options = {}) {
            this._options = options;
            this.eventHandler = new EventHandler(this);
            this.url = `wss://${options.endpoint}?v=${constants.voiceGatewayVersion}`;
        }

        // connect to voice gateway, resolves on HELLO
        connect() {
            this.heartbeatIntervalTime = null
            this.heartbeatInterval = null;
            this.lastSequence = null;

            return new Promise((resolve, reject) => {
                const stopTimeout = promiseTimeout(reject, "Timed out connecting to Voice Gateway");

                this.socket = new imports.WebSocket(this.url);

                this.socket.addEventListener("open", () => {
                    this.call("open");
                });
                this.socket.addEventListener("message", ({ data: msg }) => {
                    let parsed;
                    try {
                        const json = JSON.parse(msg);
                        parsed = {
                            sequence: json.seq,
                            op: json.op,
                            data: json.d,
                        }
                    } catch (err) { };
                    if (parsed === undefined) return;
                    this.call("data", parsed);
                    if (parsed.op) {
                        const opcode = Object.entries(constants.voiceGatewayOpcodes).find(([key, value]) => parsed.op === value)?.[0];
                        this.call("op", parsed);
                        this.call(`op-${parsed.op}`, parsed);
                        if (opcode) this.call(`op-${opcode}`, parsed);
                    }
                });
                this.socket.addEventListener("close", () => {
                    clearInterval(this.heartbeatInterval);
                    this.call("close");
                    // TODO: reconnects
                });

                this.on("data", ({ sequence }) => {
                    this.lastSequence = sequence ?? this.lastSequence;
                });
                this.once("op-HELLO", ({ data }) => {
                    if (!data.heartbeat_interval) throw new Error(`heartbeat_interval is ${data.heartbeat_interval} in HELLO event`);
                    this.heartbeatIntervalTime = data.heartbeat_interval;
                    this.heartbeatInterval = setInterval(this.heartbeat, this.heartbeatIntervalTime);
                    stopTimeout();
                    resolve();
                });
            });
        }

        heartbeatIntervalTime = null;
        heartbeatInterval = null;
        lastSequence = null;
        send = async (op, data) => this.socket.send(JSON.stringify({ op: constants.voiceGatewayOpcodes[op] ?? op, d: data?.toAPI ? await data.toAPI() : data }));
        heartbeat = () => this.send("HEARTBEAT", { t: Date.now(), seq_ack: this.lastSequence });
        identify = (options = {}) => {
            return new Promise((resolve, reject) => {
                const stopTimeout = promiseTimeout(reject, "Timed out waiting for READY event");

                this.send("IDENTIFY", new client.VoiceIdentifyParser(options));

                this.once("op-READY", async ({ data }) => {
                    stopTimeout();
                    resolve(await new client.VoiceReadyParser(data).toJSON());
                });
            });
        };
        selectProtocol = (options = {}) => {
            return new Promise((resolve, reject) => {
                const stopTimeout = promiseTimeout(reject, "Timed out waiting for SESSION_DESCRIPTION event");

                this.send("SELECT_PROTOCOL", new client.SelectProtocolParser(options));

                this.once("op-SESSION_DESCRIPTION", async ({ data }) => {
                    stopTimeout();
                    resolve(await new client.SessionDescriptionParser(data).toJSON());
                });
            });
        };
        speaking = (options = {}) => {
            this.send("SPEAKING", new client.SpeakingParser(options));
        }
    }

    return VoiceGateway;
}

module.exports = init;
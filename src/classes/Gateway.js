const constants = require("../constants");
const EventHandler = require("../EventHandler");
const promiseTimeout = require("../utils/promiseTimeout");
const imports = require("../imports");

function init(client) {
    // https://discord.com/developers/docs/events/gateway
    class Gateway {
        constructor(url) {
            this.eventHandler = new EventHandler(this);
            this.url = url ?? client.gatewayURL ?? `${constants.gatewayBaseUrl}?v=${constants.gatewayVersion}&encoding=${constants.gatewayVersion}`;
        }

        // connect to gateway, resolves on HELLO
        connect() {
            this.heartbeatIntervalTime = null
            this.heartbeatInterval = null;
            this.lastSequence = null;

            return new Promise((resolve, reject) => {
                const stopTimeout = promiseTimeout(reject, "Timed out connecting to Gateway");

                this.socket = new imports.WebSocket(this.url);

                this.socket.addEventListener("open", () => {
                    this.call("open");
                });
                this.socket.addEventListener("message", ({ data: msg }) => {
                    let parsed;
                    try {
                        const json = JSON.parse(msg);
                        parsed = {
                            sequence: json.s,
                            event: json.t,
                            op: json.op,
                            data: json.d,
                        }
                    } catch (err) { };
                    if (parsed === undefined) return;
                    this.call("data", parsed);
                    if (parsed.op) {
                        const opcode = Object.entries(constants.gatewayOpcodes).find(([key, value]) => parsed.op === value)?.[0];
                        this.call("op", parsed);
                        this.call(`op-${parsed.op}`, parsed);
                        if (opcode) this.call(`op-${opcode}`, parsed);
                    }
                    if (parsed.event) {
                        this.call("event", parsed);
                        this.call(`event-${parsed.event}`, parsed);
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
        send = (op, data) => this.socket.send(JSON.stringify({ op: constants.gatewayOpcodes[op] ?? op, d: data?.toAPI ? data.toAPI() : data }));
        heartbeat = () => this.send("HEARTBEAT", this.lastSequence);
        identify = (options = {}) => {
            return new Promise((resolve, reject) => {
                const stopTimeout = promiseTimeout(reject, "Timed out waiting for READY event");

                this.send("IDENTIFY", new client.IdentifyParser(options));

                this.once("op-READY", ({ data }) => {
                    stopTimeout();
                    resolve(new client.ReadyParser(data).toJSON());
                });
            });
        }
    }

    return Gateway;
}

module.exports = init;
const { promiseTimeout, EventHandler } = require("../utils");
const imports = require("../imports");
const constants = require("../constants");

function init(client) {
    class VoiceUDP {
        constructor(options = { }) {
            this._options = options;
            this.eventHandler = new EventHandler(this);
            this.address = options.address;
            this.port = options.port;
            this.ssrc = options.ssrc;
        }

        connect() {
            this.socket = imports.dgram.createSocket("udp4");

            this.socket.addListener("message", (msg, rinfo) => this.call("message", msg, rinfo));
        }

        performIPDiscovery() {
            return new Promise((resolve, reject) => {
                const ipDiscoveryPacket = Buffer.alloc(74);

                ipDiscoveryPacket[1] = 0x1;
                ipDiscoveryPacket.writeUInt16BE(70, 2);
                ipDiscoveryPacket.writeUInt32BE(this.ssrc, 4);
                ipDiscoveryPacket.write(this.address, 8);
                ipDiscoveryPacket.writeUInt16BE(this.port, 72);

                const stopTimeout = promiseTimeout(reject, "Timed out waiting for IP Discovery response");

                const messageEvent = (msg) => {
                    if (msg[1] !== 0x02) return;
                    const address = msg.subarray(8, 72).toString();
                    const port = msg.readUInt16BE(72);
                    this.removeListener(messageEvent);
                    stopTimeout();
                    resolve({ address, port });
                }

                this.send(ipDiscoveryPacket, err => {
                    if (err) reject(err);
                });

                this.addListener("message", messageEvent);
            });
        }

        send(msg, callback) { this.socket.send(msg, this.port, this.address, callback) }
    }

    return VoiceUDP;
}

module.exports = init;
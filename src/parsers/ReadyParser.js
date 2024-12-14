// TODO: parse guilds, shard, application etc

function init(client) {
    // https://discord.com/developers/docs/events/gateway-events#ready-ready-event-fields
    class ReadyParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        toJSON() {
            const raw = this.raw;
            const json = {
                version: raw.v,
                user: new client.UserParser(raw.user).toJSON(),
                guilds: raw.guilds,
                sessionId: raw.session_id,
                resumeGatewayUrl: raw.resume_gateway_url,
                shard: raw.shard,
                application: raw.application,
            };

            return json;
        }

        toAPI() {

        }
    }

    return ReadyParser;
}

module.exports = init;
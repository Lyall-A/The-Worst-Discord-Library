const constants = require("./constants");
const { parseEvent, EventHandler } = require("./utils");
const api = require("./api");
const classes = require("./classes");
const parsers = require("./parsers");

class Client {
    constructor(options = {}) {
        this._options = options;
        this.eventHandler = new EventHandler(this);

        this.cache = {};

        this.api = (path, options = {}) => api(path, { token: this.token, tokenType: this.tokenType, ...options });

        // classes
        for (const [ className, classInit ] of Object.entries(classes)) this[className] = classInit(this);

        // parsers
        for (const [ parserName, parserInit ] of Object.entries(parsers)) this[parserName] = parserInit(this);

        this.guilds = new this.Guilds();
        this.channels = new this.Channels();
        this.users = new this.Users();

        // options
        this.ffmpegPath = constants.defaultFFmpegPath;
    }

    login(token, tokenType) {
        return new Promise((resolve, reject) => {
            this.token = token;
            this.tokenType = tokenType;

            this.gateway = new this.Gateway();

            this.gateway.connect().then(() => {
                this.gateway.identify({
                    token: this.token,
                    ...(this._options ?? {})
                }).catch(err => reject(err));
            }).catch(err => reject(err));

            this.gateway.on("event", async ({ event, data }) => {
                this.call(event, await parseEvent(event, data, this) ?? data);
            });

            this.on("READY", event => {
                this.user = event.user;

                resolve();
            });
        });
    }
}

module.exports = Client;
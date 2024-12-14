const constants = require("./constants");
const Gateway = require("./classes/Gateway");
const EventHandler = require("./EventHandler");
const parseEvent = require("./utils/parseEvent");
const Guilds = require("./classes/Guilds");
const Channels = require("./classes/Channels");
const Users = require("./classes/Users");
const api = require("./api");
const VoiceGateway = require("./classes/VoiceGateway");
const IdentifyParser = require("./parsers/IdentifyParser");
const VoiceServerUpdateParser = require("./parsers/VoiceServerUpdateParser");
const VoiceStateUpdateParser = require("./parsers/VoiceStateUpdateParser");
const UserParser = require("./parsers/UserParser");
const ChannelParser = require("./parsers/ChannelParser");
const ReadyParser = require("./parsers/ReadyParser");
const VoiceReadyParser = require("./parsers/VoiceReadyParser");
const SessionDescriptionParser = require("./parsers/SessionDescriptionParser");
const VoiceIdentifyParser = require("./parsers/VoiceIdentifyParser");
const SelectProtocolParser = require("./parsers/SelectProtocolParser");
const SpeakingParser = require("./parsers/SpeakingParser");
const VoiceUDP = require("./classes/VoiceUDP");

class Client {
    constructor(options = {}) {
        this._options = options;
        this.eventHandler = new EventHandler(this);

        this.cache = {};

        this.api = (path, options = {}) => api(path, { token: this.token, tokenType: this.tokenType, ...options });
        this.Gateway = Gateway(this);
        this.VoiceGateway = VoiceGateway(this);
        this.VoiceUDP = VoiceUDP(this);

        this.UserParser = UserParser(this);
        this.ChannelParser = ChannelParser(this);
        this.VoiceStateUpdateParser = VoiceStateUpdateParser(this);
        this.VoiceServerUpdateParser = VoiceServerUpdateParser(this);
        this.SessionDescriptionParser = SessionDescriptionParser(this);
        this.VoiceReadyParser = VoiceReadyParser(this);
        this.ReadyParser = ReadyParser(this);
        this.IdentifyParser = IdentifyParser(this);
        this.VoiceIdentifyParser = VoiceIdentifyParser(this);
        this.SelectProtocolParser = SelectProtocolParser(this);
        this.SpeakingParser = SpeakingParser(this);

        this.Guilds = Guilds(this);
        this.Channels = Channels(this);
        this.Users = Users(this);

        this.guilds = new this.Guilds();
        this.channels = new this.Channels();
        this.users = new this.Users();
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

            this.gateway.on("event", ({ event, data }) => {
                this.call(event, parseEvent(event, data, this) ?? data);
            });

            this.on("READY", event => {
                this.user = event.user;

                resolve();
            })
        });
    }
}

module.exports = Client;
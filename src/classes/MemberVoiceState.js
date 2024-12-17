const constants = require("../constants");

function init(client) {
    class GuildVoiceStates {
        constructor(member) {
            this.member = member;
        }

        get() {
            return this.member.guild.voiceStates.get(this.member.user.id);
        }

        cache = {
            get: () => {
                return this.member.guild.voiceStates.cache.get(this.member.user.id);
            },
            add: (voiceState) => {
                return this.member.guild.voiceStates.cache.add(voiceState);
            },
            find: () => {
                return this.member.guild.voiceStates.cache.find(this.member.user.id);
            },
            findIndex: () => {
                return this.member.guild.voiceStates.cache.findIndex(this.member.user.id);
            }
        }
    }

    return GuildVoiceStates;
}

module.exports = init;
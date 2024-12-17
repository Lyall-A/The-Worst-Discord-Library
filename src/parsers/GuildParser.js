// TODO

function init(client) {
    // https://discord.com/developers/docs/resources/guild#guild-object-guild-structure
    class GuildParser {
        constructor(raw = {}) {
            this.raw = raw;
        }

        /**
         * Parse into JSON used for client
         */
        toJSON() {
            const raw = this.raw;
            const guild = {
                _cache: { }
            };

            class GuildMemberParser {
                constructor(raw = {}) {
                    this.raw = raw;
                }
        
                /**
                 * Parse into JSON used for client
                 */
                async toJSON() {
                    const raw = this.raw;
                    const member = { };
        
                    const user = raw.user ? await new client.UserParser(raw.user).toJSON() : null;
                    const voiceState = new client.MemberVoiceState(member);
                    
                    member.nickname = raw.nick;
                    member.user = user;
                    member.guild = guild;
                    member.voiceState = voiceState;
        
                    return member;
                }
        
                /**
                 * Parse into JSON to be sent to API
                 */
                toAPI() {
        
                }
            }

            const voiceStates = new client.GuildVoiceStates(guild);
            const members = new client.GuildMembers(guild);

            guild.GuildMemberParser = GuildMemberParser;
            guild.id = raw.id;
            guild.name = raw.name;
            guild.members = members;
            guild.voiceStates = voiceStates;

            return guild;
        }

        /**
         * Parse into JSON to be sent to API
         */
        toAPI() {

        }
    }

    return GuildParser;
}

module.exports = init;
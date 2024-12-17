const { Client } = require("../src");
const fs = require("fs");
const path = require("path");

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT", "GUILD_VOICE_STATES"] });

const osuPath = "/home/lyall/osu/osu!/Songs";
const osuSongs = fs.readdirSync(osuPath);
const songs = [];
for (const osuSong of osuSongs) {
    const songPath = path.join(osuPath, osuSong);
    const songFiles = fs.readdirSync(songPath);
    songs.push(...songFiles.filter(i => [".mp3"].includes(path.extname(i))).map(i => path.join(songPath, i)));
}

client.on("READY", async event => {
    console.log(`Ready as ${client.user.username}`);









    // const test = await client.guilds.cache.get("1309396066482786315");
    // console.log(test);
    // const test2 = await test.members.cache.get("492729974026141697");
    // console.log(test2);
    // const test3 = await test2.getVoiceState();
    // console.log(test3);

    const channel = await client.channels.get(process.env.CHANNEL_ID);
    const voice = new client.Voice(channel);
    // voice.setArgs([ "-af", "bass=g=5" ]);
    await voice.prepare();

    let data = [];
    let loop = false;
    voice.on("playing", () => data = [ ]);
    voice.on("data", i => data.push(i));
    voice.on("stopped", () => {
        if (loop && voice.input) voice.play(voice.input);
    });
    client.on("MESSAGE_CREATE", async msg => {
        if (msg.author.id === client.user.id) return;
        // return console.log(msg.member)
        const [command, ...args] = msg.content.split(" ");
        if (command === "!play") {
            await voice.stop();
            voice.play(args.join(" "));
            msg.reply(`ok \`${args.join(" ")}\` (faggot faggo)`)
        }
        if (command === "!start-args") voice.setArgs(args);
        if (command === "!end-args") voice.setArgs(null, args);
        if (command === "!stop") voice.stop();
        if (command === "!replay" && voice.input) voice.play(voice.input);
        if (command === "!say") msg.reply(args.join(" "));
        if (command === "!send") {
            // const form = new FormData();
            // form.append("payload_json", JSON.stringify({ content: "piss" }));
            // form.append("files[0]", new Blob([Buffer.concat(data)], { type: "audio/opus" }), "kill yourself.ogg");
            client.api(`/channels/${msg.channel.id}/messages`, { method: "POST", multipart: {
                json: { content: "piss" },
                files: [
                    {
                        filename: "kill yourself.ogg",
                        type: "audio/ogg",
                        // data: Buffer.concat(data)
                        data: fs.readFileSync("/home/lyall/Downloads/slap my cock.mp3")
                    }
                ]
            } });
        }
        if (command === "!update" && voice.input) {
            const idk = voice.args.indexOf("-ss");
            // const secs = Math.floor(voice.duration / 1000).toString();
            const duration = args[0] ? args[0] * 1000 : voice.duration;
            const secs = (duration / 1000).toString();
            idk >= 0 ? voice.args[idk + 1] = secs : voice.args.push(...["-ss", secs]);
            console.log(secs, voice.args)
            await voice.stop();
            voice.play(voice.input);
            voice.duration = duration;
        }
        if (command === "!random") {
            await voice.stop();
            const i = songs[Math.floor(Math.random() * songs.length)];
            voice.play(i);
            msg.reply(`ok \`${i}\` (faggot faggo)`)
        }
        if (command === "!loop") {
            loop = !loop;
            msg.reply(":thumbs_up:");
        }
        console.log(`[${msg.channel.name}] ${msg.content}`);
        // if (msg.author.id !== "492729974026141697") msg.reply(`"${msg.content}" :nerd::nerd::nerd:`);
        // msg.reply(`"${msg.content}" :nerd::nerd::nerd:`);
    });
});


client.login(process.env.DISCORD_TOKEN);
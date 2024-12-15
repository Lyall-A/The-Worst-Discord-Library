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
    const channel = await client.channels.get(process.env.CHANNEL_ID);
    const voice = new client.Voice(channel);
    // voice.setArgs([ "-af", "bass=g=5" ]);
    await voice.prepare();

    let loop = false;
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
            msg.reply(`ok ${args.join(" ")}`)
        }
        if (command === "!args") voice.setArgs(args);
        if (command === "!stop") voice.stop();
        if (command === "!replay" && voice.input) voice.play(voice.input);
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
            msg.reply(`ok ${i}`)
        }
        if (command === "!loop") loop = !loop;
        console.log(`[${msg.channel.name}] ${msg.content}`);
        // msg.reply(`"${msg.content}" :nerd::nerd::nerd:`);
    });
});


client.login(process.env.DISCORD_TOKEN);
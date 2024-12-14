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

console.log(songs.length);

client.on("READY", async event => {
    console.log(`Ready as ${client.user.username}`);
    const channel = await client.channels.get(process.env.CHANNEL_ID);
    const voice = new client.Voice(channel);
    await voice.prepare();
    // voice.setFFmpegArgs([ "-af", "asetrate=44100*1.2" ]);
    // voice.play(process.env.TRACK_INPUT);

    const randomSong = songs[Math.floor(Math.random() * songs.length)];
    voice.play(randomSong);
    console.log(randomSong);

    // voice.on("stopped", () => voice.play(songs[Math.floor(Math.random() * songs.length)]));

    // console.log(piss);
    // voice.play(process.env.TRACK_INPUT);
    client.on("MESSAGE_CREATE", async msg => {
        if (msg.author.id === client.user.id) return;
        if (msg.content === "!random osu song funny funny funny") {
            await voice.stop();
            const i = songs[Math.floor(Math.random() * songs.length)];
            voice.play(i);
            msg.reply(`ok ${i}`)
        }
        console.log(`[${msg.channel.name}] ${msg.content}`);
        // msg.reply(`"${msg.content}" :nerd::nerd::nerd:`);
    });
});


client.login(process.env.DISCORD_TOKEN);
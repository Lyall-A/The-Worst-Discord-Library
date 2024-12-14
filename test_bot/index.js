const { Client } = require("../src");

const client = new Client({ intents: ["GUILDS", "GUILD_MESSAGES", "MESSAGE_CONTENT", "GUILD_VOICE_STATES"] });

client.on("READY", async event => {
    console.log(`Ready as ${client.user.username}`);
    const channel = await client.channels.get(process.env.CHANNEL_ID);
    const voice = new client.Voice(channel);
    await voice.prepare();
    voice.setFFmpegArgs([ "-af", "asetrate=44100*1.2" ]);
    voice.play(process.env.TRACK_INPUT);
});

client.on("MESSAGE_CREATE", msg => {
    if (msg.author.id === client.user.id) return;
    console.log(`[${msg.channel.name}] ${msg.content}`);
    msg.reply(`"${msg.content}" :nerd::nerd::nerd:`)
});

// setInterval(() => {
    // console.log(client.cache);
// }, 5000);

client.login(process.env.DISCORD_TOKEN);
const { REST, Routes, Client, GatewayIntentBits, Collection } = require("discord.js");
const { msgAddCount } = require("./modules/message.js");
const observe = require("./dashboard/observe");
const fs = require("fs");

require("dotenv").config();

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

loadAllCommands(client, "./commands");

client.on("messageCreate", async (message) => {
    if (message.author.bot === true) {
        return; // 如果是機器人發出的訊息，就不要回覆（避免回覆自己）
    }
    // console.log(message);

    msgAddCount(message);

    console.log(
        `在 ${message.guild.name} > ${message.channel.name} 收到來自 ${message.member.displayName} 的訊息：${message.content}`,
    );
});
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    console.log(
        `在 ${interaction.guild.name} > ${interaction.channel.name} 收到來自 ${interaction.user.tag}`,
    );

    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
        await command.execute(client, interaction);
    } catch (error) {
        console.error(error);
        // console.log(error.rawError);
    }
});

client.once("ready", async (client) => {
    console.log(`${client.user.tag} 已上線！`);
});

client.login(process.env.TOKEN);
observe(client)
    .start()
    .then((url) => console.log(`你可以在 ${url} 觀察 Bot 的狀態`));

function loadAllCommands(client, directory) {
    // 將 client.commands 設為一個 Collection，用來儲存所有的 commands
    client.commands = new Collection();
    const commands = [];

    // 讀取 commands 目錄下的所有 js 檔案
    const commandFiles = fs.readdirSync(directory).filter((file) => file.endsWith(".js"));

    // 將每個檔案 require 進來，並且設定到 client.commands 裡面
    for (const file of commandFiles) {
        const command = require(`${directory}/${file}`);
        client.commands.set(command.data.name, command);
        commands.push(command.data.toJSON());
    }

    const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

    // 向 Discord 註冊 commands
    rest.put(Routes.applicationCommands(process.env.BOTID), { body: commands })
        .then((data) => console.log(`Successfully registered ${data.length} application commands.`))
        .catch(console.error);
}

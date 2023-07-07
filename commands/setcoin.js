const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require("discord.js");
const fs = require("fs");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("setcoin")
        .setDescription("修改使用者金幣")
        .addStringOption((option) =>
            option.setName("player").setDescription("請選擇玩家名").setRequired(true),
        )
        .addNumberOption((option) =>
            option.setName("coin").setDescription("請輸入修改金額!").setRequired(true),
        ),

    async execute(client, interaction) {
        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);

        let playerid = interaction.options.getString("player");
        // remove first two char and last char in playerid
        // <@338152155619786753> to 338152155619786753
        playerid = playerid.substring(2, playerid.length - 1);
        let coin = interaction.options.getNumber("coin");

        // find player index in bank with playerid
        let found = 0;
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == playerid) {
                found = 1;
                break;
            }
        }
        if (found == 0) {
            interaction.reply("找不到使用者!");
            return;
        }
        // check if user is admin

        let playerIndex = -1;
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == interaction.user.id) {
                playerIndex = i;
                break;
            }
        }

        if (bank[playerIndex].isAdmin == 1) {
            let found = 0;
            for (let i = 0; i < bank.length; i++) {
                if (bank[i].ID == playerid) {
                    found = 1;
                    bank[i].Coin = coin;
                    interaction.reply(`${bank[i].Username}的金幣已修改為${bank[i].Coin}元!`);
                    break;
                } else {
                }
            }
        } else {
            interaction.reply("想幹嘛呢? 這可是管理員才能用呢!");
        }
        const json = JSON.stringify(bank);
        fs.writeFileSync("bank.json", json);
    },
};

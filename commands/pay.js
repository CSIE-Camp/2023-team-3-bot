const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require("discord.js");
const fs = require("fs");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("pay")
        .setDescription("送人錢錢")
        .addStringOption((option) =>
            option.setName("player").setDescription("請 @ 玩家名").setRequired(true),
        )
        .addNumberOption((option) =>
            option.setName("coin").setDescription("請輸入送出金額").setRequired(true),
        ),

    async execute(client, interaction) {
        // check coin is positive
        if (interaction.options.getNumber("coin") <= 0) {
            interaction.reply("金額必須大於 0");
            return;
        }

        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);

        let playerid = interaction.options.getString("player");
        // remove first two char and last char in playerid
        // <@338152155619786753> to 338152155619786753
        playerid = playerid.substring(2, playerid.length - 1);
        let coin = interaction.options.getNumber("coin");

        // find target player index in bank with playerid
        let targetIndex = -1;
        let found = 0;
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == playerid) {
                found = 1;
                targetIndex = i;
                break;
            }
        }
        if (found == 0) {
            interaction.reply("找不到玩家");
            return;
        }

        // find user index in bank with interaction.user.id
        let userIndex = -1;
        found = 0;
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == interaction.user.id) {
                found = 1;
                userIndex = i;
                break;
            }
        }
        if (found == 0) {
            interaction.reply("找不到你的資料");
            return;
        }

        // check if user has enough money
        if (bank[userIndex].Coin < coin) {
            interaction.reply("你的錢不夠喔");
            return;
        }

        // send money
        bank[targetIndex].Coin += coin;
        bank[userIndex].Coin -= coin;

        // save bank
        fs.writeFileSync("bank.json", JSON.stringify(bank));

        // reply

        interaction.reply(
            `已送達 ${bank[targetIndex].Username} 帳號 ${coin} 元\n` +
                `您的 ${bank[userIndex].Username} 帳號剩餘 ${bank[userIndex].Coin} 元`,
        );

        // for (let i = 0; i < bank.length; i++) {
        //     if (bank[i].ID == interaction.user.id) {
        //         targetIndex = i;
        //         break;
        //     }
        // }
        // let iuid;
        // for (let i = 0; i < bank.length; i++) {
        //     if (bank[i].ID == interaction.user.id) {
        //         iuid = i;
        //     }
        // }
        // for (let i = 0; i < bank.length; i++) {
        //     if (bank[i].ID == playerid) {
        //         if (bank[iuid].Coin >= coin) {
        //             found = 1;
        //             bank[i].Coin += coin;
        //             bank[iuid].Coin -= coin;
        //             interaction.reply(`${bank[i].Username}的錢錢已修改為${bank[i].Coin}元`);
        //             interaction.reply(`${bank[iuid].Username}的錢錢已修改為${bank[iuid].Coin}元`);
        //             break;
        //         } else {
        //             interaction.reply("送錢失敗，看來你的錢不夠喔...");
        //         }
        //     }
        // }
    },
};

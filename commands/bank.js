const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require("discord.js");
const fs = require("fs");
module.exports = {
    data: new SlashCommandBuilder().setName("bank").setDescription("查詢自己的錢錢"),

    async execute(client, interaction) {
        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);

        let found = false;
        let embed = new EmbedBuilder().setColor("#FFC842");
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == interaction.user.id) {
                found = true;
                coinAmmount = bank[i].Coin;
                embed.setTitle(`${ID}的銀行`).setDescription(`你的錢錢: ${bank[i].Coin}`);
                continue;
            }
        }
        if (found == false) {
            embed
                .setTitle("你還沒有帳戶哦！ :(")
                .setDescription("你可以使用 /signup 創建帳戶！");
        }

        interaction.reply({ embeds: [embed] });
        const json = JSON.stringify(bank);
        fs.writeFileSync("bank.json", json);
    },
};

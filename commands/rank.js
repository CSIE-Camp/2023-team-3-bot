const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require("discord.js");
const fs = require("fs");
module.exports = {
    data: new SlashCommandBuilder().setName("rank").setDescription("查看財富排行榜"),

    async execute(client, interaction) {
        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);

        // sort bank by bank[i].Coin
        bank.sort((a, b) => {
            return b.Coin - a.Coin;
        });


        // bank = bank.sort((a, b) => {
        //     if (a.Coin < b.Coin) {
        //         return 1;
        //     }
        // });

        let message = "";
        if (bank.length > 5) {
            for (let k = 0; k < 5; k++) {
                message += `第 ${k + 1} 名：<@${bank[k].ID}> (${bank[k].Username}) 的財富為 ${bank[k].Coin} 元\n`;
            }
            for (let i = 0; i < bank.length; i++) {
                if (bank[i].ID == interaction.user.id) {
                    message += `\n你的名次為第 ${i + 1} 名：${bank[i].Coin} 元\n`;
                }
            }
        } else {
            for (let k = 0; k < bank.length; k++) {
                message += `第 ${k + 1}名：<@${bank[k].ID}> (${bank[k].Username}) 的財富為 ${bank[k].Coin} 元\n`;
            }
        }
        interaction.reply(message);
        const json = JSON.stringify(bank);
        fs.writeFileSync("bank.json", json);
    },
};

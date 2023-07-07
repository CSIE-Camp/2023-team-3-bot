const { SlashcleBuilder, EmbedBuilder, SlashCommandBuilder, Client, Embed } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("dice").setDescription("擲 1d6 骰子下賭注"),
    async execute(client, interaction) {
        let dice = Math.floor(Math.random() * 6) + 1;
        let earnings = (dice >= 4 ? dice - 3 : dice - 4) * 2;
        const jsonDataIn = fs.readFileSync("bank.json");
        let bank = JSON.parse(jsonDataIn);

        let found = 0;
        let ammount = 0;
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == interaction.user.id) {
                bank[i].Coin += earnings;
                ammount = bank[i].Coin;
                found = 1;
                let diceEmbed = new EmbedBuilder()
                    .setColor("#353535")
                    .setTitle(`你擲到了 ${dice}，贏得了 ${earnings} 元！`)
                    .setDescription(`你現在共有 ${ammount} 元！ `);
                interaction.reply({ embeds: [diceEmbed] });
                break;
            }
        }

        if (!found) {
            interaction.reply("U hav no account ;(");
            return;
        }
        //stringify bank 並存回 bank.json
        // await interaction.reply(`獲得 ${earnings}，共 : ${ammount}`);
        const jsonDataOut = JSON.stringify(bank);
        fs.writeFileSync("bank.json", jsonDataOut);
    },
};

const { SlashcleBuilder, EmbedBuilder, SlashCommandBuilder, Client, Embed } = require("discord.js");
const fs = require("fs");

module.exports = {
    data: new SlashCommandBuilder().setName("dice").setDescription("hihiih"),
    async execute(client, interaction) {
        let dice = Math.floor(Math.random() * 6) + 1;
        let earnings = 0;
        if (dice == 1){
            earnings = -10;
        }
        if (dice == 2){
            earnings = -6;
        } 
        if (dice == 3){
            earnings = -2;
        }
        if (dice == 4){
            earnings = 2;
        }
        if (dice == 5){
            earnings = 6;
        }
        if (dice == 6){
            earnings = 10;
        }

        const jsonDataIn = fs.readFileSync("bank.json");
        let bank = JSON.parse(jsonDataIn);
       
        let found = 0;
        let ammount = 0;
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID === interaction.user.id) {
                bank[i].Coin += earnings;
                ammount = bank[i].Coin;
                found = 1;
                let diceEmbed = new EmbedBuilder()
                    .setColor("#353535")
                    .setTitle(`你贏得了${earnings}元！`)
                    .setDescription(`你現在共有${ammount}元！ `);
                interaction.reply({ embeds: [diceEmbed] });
                break;
            }
        }

        //如果沒有資料就創建一個新的並回覆結果
        if (!found) {
            newBlayer = { ID: interaction.user.id, Coin: earnings };
            ammount = newBlayer.Coin;
            bank.push(newBlayer);
        }
        //stringify bank 並存回 bank.json
        await interaction.reply(`獲得 ${earnings}，共 : ${ammount}`);
        const jsonDataOut = JSON.stringify(bank);
        fs.writeFileSync("bank.json", jsonDataOut);
     
    },
};

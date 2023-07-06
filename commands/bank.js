const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require('discord.js');
const fs = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('bank')
        .setDescription('查詢自己的錢錢'),
    
    async execute(client, interaction) {
        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);
    
        let found = false;
        let coinAmmount = 0;
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == interaction.user.id) {
                found = true;
                coinAmmount = bank[i].Coin
            }
        };
        if (found == false) {
            bank.push({ ID: interaction.user.id, bank: 10 });
            coinAmmount = 10;
        }

        const embed = new EmbedBuilder()
            .setTitle("Your Bank")
            .setColor("#ffffff")
            .setDescription(`Your coin: ${coinAmmount}`);
        
        interaction.reply({ embeds: [embed] });
        const json = JSON.stringify(bank);
        fs.writeFileSync("bank.json", json);
    }
}


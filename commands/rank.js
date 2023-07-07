const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require("discord.js");
const fs = require("fs");
module.exports = {
    data: new SlashCommandBuilder()
        .setName("rank")
        .setDescription("查看財富排行榜"),
       
    async execute(client, interaction) {
        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);

        bank = bank.sort((a, b) => {
            if (a.Coin < b.Coin) {
              return 1;
            }
          });

        
        // remove first two char and last char in playerid
        // <@338152155619786753> to 338152155619786753
        playerid = playerid.substring(2, playerid.length - 1);
        let coin = interaction.options.getNumber("coin");

        // find player index in bank with playerid
        
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == playerid) {
                found = 1;
                break;
            }
        }
        if(bank.length >5 ){
            for (let k = 0; k < 5; k++) {
            interaction.reply(`第k+1名：${bank[k].Username}的財富為${bank[k].Coin}元`);
        }
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == interaction.user.id){
                interaction.reply(`第i+1名：${bank[i].Username}的財富為${bank[i].Coin}元`);
           }   
        }
        }
        else{
            for (let k = 0; k < bank.length; k++) {
                interaction.reply(`第k+1名：${bank[k].Username}的財富為${bank[k].Coin}元`);
            }
        }
        const json = JSON.stringify(bank);
        fs.writeFileSync("bank.json", json);
    },
};

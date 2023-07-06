const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require('discord.js');
const fs = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setcoin')
        .setDescription('修改錢錢')
        .addStringOption((option) =>
            option.setName("playerid").setDescription("請選擇玩家名").setRequired(true))
        .addNumberOption((option) =>
            option.setName("coin").setDescription("請輸入修改金額").setRequired(true)),
        
    async execute(client, interaction) {
        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);
    
        
        let playerid = interaction.options.getString("playerid");
        let coin = interaction.options.getNumber("coin");

        if(`$isAdmin[interaction.user.id]` == true){
            let found = 0;
            for (let i = 0; i < bank.length; i++) {
                if (bank[i].ID == playerid) {
                    found = 1;
                    bank[i].Coin = coin;
                    interaction.reply(`${bank[i].Username}的錢錢已修改為${bank[i].Coin}元`);
                    break;
                }else{
                    
                   bank.push({ ID: interaction.user.id, bank: 10 });
                 coinAmmount = 10;
                } 
            }
        }else{
            interaction.reply( "非常抱歉，您的權限不足" );
        }
        const json = JSON.stringify(bank);
        fs.writeFileSync("bank.json", json);
    }

}

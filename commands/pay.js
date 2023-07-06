const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require('discord.js');
const fs = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('pay')
        .setDescription('送人錢錢')
        .addStringOption((option) =>
            option.setName("playerid").setDescription("請選擇玩家名").setRequired(true))
        .addNumberOption((option) =>
            option.setName("coin").setDescription("請輸入送出金額").setRequired(true)),
        
    async execute(client, interaction) {
        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);
    
        let playerid = interaction.options.getString("playerid");
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
            interaction.reply("找不到玩家");
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
            
            for (let i = 0; i < bank.length; i++) {
                if (bank[i].ID == interaction.user.id) {
                    let iuid = i;
                    }
                }
            for (let i = 0; i < bank.length; i++) {
                if (bank[i].ID == playerid) {
                    if (bank[iuid].Coin >= coin) {
                         found = 1;
                    bank[i].Coin += coin;
                    bank[iuid].Coin -= coin;
                    interaction.reply(`${bank[i].Username}的錢錢已修改為${bank[i].Coin}元`);
                    interaction.reply(`${bank[iuid].Username}的錢錢已修改為${bank[iuid].Coin}元`);
                    break;
                    }
                else{
                    interaction.reply("送錢失敗，看來你的錢不夠喔...");
                } 
            }

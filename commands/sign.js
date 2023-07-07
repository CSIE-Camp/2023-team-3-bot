const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const fs = require("fs");
module.exports = {
    
    data: new SlashCommandBuilder().setName("sign").setDescription("每日簽到系統"),
    async execute(client, interaction) {
    
    const data = fs.readFileSync("bank.json");
    let bank = JSON.parse(data);

    let LatestMsgTime = 0;

    for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == interaction.user.id){
                if (Date.now() - bank[i].LatestMsgTime > 86400000 || bank[i].LatestMsgTime == null){
                  bank[i].Coin += 100;
                    interaction.reply(`你獲得了100元，你現在共有 ${bank[i].Coin}元，感謝你的簽到！` );
                    bank[i].LatestMsgTime = Date.now();
                }
            else{
                interaction.reply("距離上次簽到太近了，請一段時間後再來！");
            }
        }

    }
        const json = JSON.stringify(bank);
        fs.writeFileSync("bank.json", json);
    },
};

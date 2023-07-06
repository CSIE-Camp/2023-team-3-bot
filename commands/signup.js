const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require('discord.js');
const fs = require('fs');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('signup')
        .setDescription('創建帳號')
        .addStringOption(option =>
                        option.setName('username')
                            .setDescription('Your Bank Username')
                            .setRequired(true)),
    
    async execute(client, interaction) {
        // await interaction.deferReply({ content: "Creating your account..." })

        const data = fs.readFileSync("bank.json");
        let bank = JSON.parse(data);
    
        let found = false;
        let coinAmmount = 0;
        for (let i = 0; i < bank.length; i++) {
            if (bank[i].ID == interaction.user.id) {
                found = true;
                await interaction.reply(`U already have a bank account named "${bank[i].Username}" :(`);
                return;
            }
        };

        // get timestamp
        let date_ob = new Date();
        
        // create new account in bank.json
        // [{"ID":"338152155619786753","Username":"skyhong.tw","Coin":29,"isAdmin":0,"Emali":"","LatestMsgTime":"2023-07-06T13:45:00.000Z","MsgCount":0}]
        newBlayer = { "ID": interaction.user.id, "Username": interaction.options.getString('username'), "Coin": 10, "isAdmin": 0, "Emali": "", "LatestMsgTime": date_ob, "MsgCount": 0 }
        bank.push(newBlayer);

        let embed = new EmbedBuilder()
                        .setColor("#FFC842")
                        .setTitle("Your Bank Has Been Created!")
                        .setDescription(`Your Coin: ${newBlayer.Coin}
Your Username: ${newBlayer.Username}
isAdmin: ${newBlayer.isAdmin}
Emali: ${newBlayer.Emali}
Your LatestMsgTime: ${newBlayer.LatestMsgTime}
Your MsgCount: ${newBlayer.MsgCount}`);
        
        interaction.reply({ embeds: [embed] });
        const json = JSON.stringify(bank);
        fs.writeFileSync("bank.json", json);
    }
}


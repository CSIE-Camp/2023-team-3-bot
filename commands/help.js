const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
// const { SlashCommandBuilder, EmbedBuilder} = require("discord.js");
// const { MessageActionRow, MessageButton} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("help"),
    async execute(client, interaction) {
        const help = new EmbedBuilder()
            .setTitle("C0in-Mast3r")
            .setColor("#FFC842")
            .setDescription(
                "這裡是 NTNU CISE CAMP 三眼怪星球做的 Discord Bot!\n 你可以在這裡查看 C0in-Mast3r 所有的功能!",
            )
            .setImage("https://images.plurk.com/rmIc-1BCPk1VN0bCSqpZCh2HRiZ.gif");
        interaction.reply({ embeds: [help] });

        // const link = new ButtonBuilder()
        //     .setStyle(ButtonStyle.Link)
        //     .setCustomId('link')
        //     .setURL('https://github.com/CSIE-Camp/C0in-Mast3r')
        //     .setLabel('點我查看所有功能！');

        const LinkButton = new ButtonBuilder()
            // .addComponents(
            // new ButtonBuilder()
                .setLabel('點我查看所有功能！')
                .setCustomId('link')
                .setURL("https://github.com/CSIE-Camp/C0in-Mast3r")
                .setStyle(ButtonStyle.Link);
        
        // const collectLink = interaction.channel.createMessageComponentCollector({ time: 60000 });
        // console.log(collected);
                

    },
};

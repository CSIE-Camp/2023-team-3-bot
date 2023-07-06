const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder().setName("help").setDescription("help"),
    async execute(client, interaction) {
        const help = new EmbedBuilder()
            .setTitle("C0in-Mast3r")
            .setColor("#FFC842")
            .setDescription("這裡是 NTNU CISE CAMP 三眼怪星球做的 Discord Bot!")
            .setImage(
                "https://media0.giphy.com/media/N9SJ8eZZaHZQGDsneP/giphy.gif?cid=ecf05e47er7yxmcsd138me6e9ck9bkwf1je2wss6f20iawhw&ep=v1_gifs_search&rid=giphy.gif&ct=g",
            );
        interaction.reply({ embeds: [help] });
    },
};

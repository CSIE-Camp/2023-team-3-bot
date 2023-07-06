const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder().setName("embed").setDescription("embed"),
    async execute(client, interaction) {
        const embed = new EmbedBuilder()
            .setTitle("I'm an Embed")
            .setColor("#ffffff")
            .setDescription("Hello world!")
            .setImage(
                "https://media0.giphy.com/media/N9SJ8eZZaHZQGDsneP/giphy.gif?cid=ecf05e47er7yxmcsd138me6e9ck9bkwf1je2wss6f20iawhw&ep=v1_gifs_search&rid=giphy.gif&ct=g",
            );
        interaction.reply({ embeds: [embed] });
    },
};

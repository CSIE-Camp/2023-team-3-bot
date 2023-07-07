const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder().setName("emali").setDescription("E你ㄇ"),

    async execute(client, interaction) {
        await interaction.reply("E你ㄇ Emali");
    },
};

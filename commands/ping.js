const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
module.exports = {
    data: new SlashCommandBuilder().setName("ping").setDescription("ping pong ping pong ping"),

    async execute(client, interaction) {
        await interaction.reply("Pong!!");
    },
    // data: new SlashCommandBuilder().setName('embed').setDescription('embed'),
    // async execute(client,interaction){
    //     const embed = new EmbedBuilder().setTitle('I\'m an Embed')
    //     .setColor('Red')
    //     .setDescription('Hello world!')
    //     .addFields([
    //         {
    //             name: 'field 1',
    //             value: 'field 1 value',
    //             inline: true
    //         },
    //         {
    //             name: 'field 2',
    //             value: 'field 2 value',
    //             inline: true
    //         }
    //     ])
    //     interaction.reply({embeds:[embed]})
    // }
};

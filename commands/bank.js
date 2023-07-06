const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
    
module.exports = {
    
    async execute(client, interaction) {
        const data = fs.readFileSync("players.json");
    let players = JSON.parse(data);
    
        let found = false;
        for (let i = 0; i < players.length; i++) {
            if (players[i].id == interaction.user.id) {
            found = true;
             interaction.reply({ embeds: [embed] });
         }
    };
    if (found == false) {
        players.push({ id: interaction.user.id, money: 500 });
        interaction.reply({ embeds: [embed] });
   
    }
    const json = JSON.stringify(players);
    fs.writeFileSync("players.json", json);
    }
}


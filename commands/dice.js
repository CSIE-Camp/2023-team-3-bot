const { SlashCommandBuilder, EmbedBuilder, Client, Embed } = require('discord.js');
const fs = require('fs');

module.exports = {
	data: new SlashCommandBuilder().setName('dice').setDescription('hihiih'),
	async execute(client, interaction) {

    	//隨機取得結果（ 1 ~ 6 )
        let dice = Math.floor(Math.random()*6)+1;
    	//從結果計算獲得/失去的 money
        let earnings = (dice > 4) ? dice: dice-4;
    	//讀取 players.json 並 parse 成 players
        const jsonDataIn = fs.readFileSync('player.json');
        let players = JSON.parse(jsonDataIn);
    	//在所有資料中尋找呼叫此指令玩家的資料
        let found = 0;
        let ammount = 0;
    	for (let i = 0; i < players.length; i++) {  
        	//如果有就修改該玩家的 money 並回覆結果
            if(players[i].id === interaction.user.id){
                if(earnings)    players[i].money += earnings;
                ammount = players[i].money;
                found = 1;
                let diceEmbed = new EmbedBuilder()
                    .setColor("#353535")
                    .setTitle(`You win ${earnings}!`)
                    .setDescription(`You have ${ammount} now!`);
                interaction.reply({embeds:[diceEmbed]});
                break;
            }
            
    	}

        //如果沒有資料就創建一個新的並回覆結果
        if(!found){
            newPlayer = { "id": interaction.user.id, "money": earnings }
            ammount=newPlayer.money;
    	    players.push(newPlayer);
            
        }
    	//stringify players 並存回 players.json
        const jsonDataOut = JSON.stringify(players);
        fs.writeFileSync('player.json', jsonDataOut);
        await interaction.reply(`add ${earnings} ammount : ${ammount}`)

	}
};

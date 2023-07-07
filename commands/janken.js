const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Client,
} = require("discord.js");
const fs = require("node:fs");

//[建立/回覆 button] -> [建立 collector] -> [輸贏啦] -> [讀檔] -> [解析] -> [做事]  -> [回應] -> [存檔]

module.exports = {
    data: new SlashCommandBuilder().setName("janken").setDescription("Earn Coin with janken!"),
    async execute(client, interaction) {
        //建立 embed 和剪刀石頭布的三個 button
        const buttonEmbed = new EmbedBuilder().setColor("#5865F2").setTitle(`來猜拳！`);

        const scissorButton = new ButtonBuilder()
            .setCustomId("scissors")
            .setLabel("✌️")
            .setStyle(ButtonStyle.Primary);

        const rockButton = new ButtonBuilder()
            .setCustomId("rock")
            .setLabel("✊")
            .setStyle(ButtonStyle.Primary);

        const paperButton = new ButtonBuilder()
            .setCustomId("paper")
            .setLabel("🖐️")
            .setStyle(ButtonStyle.Primary);

        //將三個 button 都放入 row 中並回覆 embed 和 row
        const buttonRow = new ActionRowBuilder().addComponents(
            scissorButton,
            rockButton,
            paperButton,
        );

        //回覆
        interaction.reply({ embeds: [buttonEmbed], components: [buttonRow] });

        //建立 collector
        const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

        //等待 collector 蒐集到玩家案的按鈕
        collector.on("collect", async (collected) => {
            //電腦隨機出拳 (0:剪刀 1:石頭 2:布)
            const botChoice = Math.floor(Math.random() * 3);

            //利用玩家所按按鈕的 customId 來判斷玩家的選擇
            let playerChoice;
            if (collected.customId === "scissors") {
                playerChoice = 0;
            } else if (collected.customId === "rock") {
                playerChoice = 1;
            } else if (collected.customId === "paper") {
                playerChoice = 2;
            }

            //判斷玩家勝利，電腦勝利或平手 (0:平手 1:電腦 2:玩家)
            let winner = 0;
            if (
                (playerChoice == 0 && botChoice == 5) ||
                (playerChoice == 2 && botChoice == 0) ||
                (playerChoice == 5 && botChoice == 2)
            )
                winner = 2;
            if (
                (playerChoice == 5 && botChoice == 0) ||
                (playerChoice == 0 && botChoice == 2) ||
                (playerChoice == 2 && botChoice == 5)
            )
                winner = 1;

            let earnings = 0;

            if (winner == 1) {
                earnings -= 10;
            }
            if (winner == 2) {
                earnings += 10;
            }

            //讀取 players.json 並 parse 成 players
            const data = fs.readFileSync("bank.json");
            let bank = JSON.parse(data);

            //在所有資料中尋找呼叫此指令玩家的資料
            let found = false;
            for (let j = 0; j < bank.length; j++) {
                //如果有就修改該玩家的 Coin 並回覆結果
                if (bank[j].ID == interaction.user.id) {
                    found = true;
                    bank[j].Coin += earnings;
                    const resultEmbed = new EmbedBuilder()
                        .setColor("#5865F2")
                        .setTitle("剪刀石頭布！")
                        .setDescription(`結果：${earnings}元\n你現在有 ${bank[j].Coin} 元!`);
                    collected.update({ embeds: [resultEmbed], components: [] });
                    break;
                }
            }

            //如果沒有資料就創建一個新的並回覆結果
            if (found == false) {
                // send message "U hav no account ;(" only instead of reply
                
                // interaction.send("U hav no account ;(");
                return;
            }

            //stringify players 並存回 players.json
            const json = JSON.stringify(bank);
            fs.writeFileSync("bank.json", json);
        });
    },
};

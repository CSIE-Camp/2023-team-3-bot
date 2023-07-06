const {
    SlashCommandBuilder,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Client,
} = require("discord.js");
const fs = require("node:fs");
module.exports = {
    data: new SlashCommandBuilder().setName("blackjack").setDescription("Play blackjack! (21 點)"),
    /**
     *
     * @param {Client} client
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
    async execute(client, interaction) {
        const moreEmbed = new ButtonBuilder()
            .setCustomId("more")
            .setLabel("再要一張")
            .setStyle(ButtonStyle.Primary);

        const denyEmbed = new ButtonBuilder()
            .setCustomId("deny")
            .setLabel("不要了")
            .setStyle(ButtonStyle.Primary);
        const seeResult = new ButtonBuilder()
            .setCustomId("result")
            .setLabel("看結果")
            .setStyle(ButtonStyle.Primary);

        const buttonRow = new ActionRowBuilder().addComponents(moreEmbed, denyEmbed);
        const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });
        //topic : 產生52張牌並洗牌
        //subtopic : generate 52 cards
        const suits = ["♠", "♥", "♦", "♣"];
        let cards = new Array();
        suits.forEach((suits) => {
            for (let i = 1; i <= 13; i++) {
                switch (i) {
                    case 1:
                        cards.push(suits + "A");
                        break;
                    case 11:
                        cards.push(suits + "J");
                        break;
                    case 12:
                        cards.push(suits + "Q");
                        break;
                    case 13:
                        cards.push(suits + "K");
                        break;
                    default:
                        cards.push(suits + i);
                        break;
                }
            }
        });
        // subtopic : shuffle cards
        shuffleArray(cards);
        console.log(cards);

        //topic : 起始發牌
        let userCards = new Array();
        let computerCards = new Array();
        hitCard(cards, userCards, 2);
        hitCard(cards, computerCards, 2);

        let allStr = "你現在有";
        const askStr = ", 還要繼續要牌嗎？";
        userCards.forEach((card) => {
            allStr += " " + card;
        });
        let buttonEmbed = new EmbedBuilder()
            .setColor("#00ffff")
            .setTitle(`決戰21點`)
            .setDescription(allStr);
        if (cardCalc(userCards, true) === 21) {
            await interaction.reply({ embeds: [buttonEmbed], components: [seeResult] });
        } else {
            allStr += askStr;
            buttonEmbed.setDescription(allStr);
            await interaction.reply({ embeds: [buttonEmbed], components: [buttonRow] });
        }

        //topic : 玩家補牌
        let ask = true;
        let userScore = 0;
        let userBomb = false;
        collector.on("collect", async (collected) => {
            ask = collected.customId === "more";
            let buttonEmbed = new EmbedBuilder().setColor("#ffffff").setTitle(`決戰21點`);
            if (seeResult) userScore = 21;
            if (ask) {
                const newCard = hitCard(cards, userCards);
                buttonEmbed.setDescription(`你抽到了 ${newCard}`);
                userScore = judgeContainedCase(userCards);
                if (userScore > 21) {
                    userBomb = true;
                } else if (userScore === 21) {
                    await collected.reply({ embeds: [buttonEmbed] });
                } else {
                    await collected.reply({ embeds: [buttonEmbed], components: [buttonRow] });
                    return;
                }
            } else {
                userScore = judgeContainedCase(userCards);
            }

            //topic : 電腦補牌
            let computerScore = judgeContainedCase(computerCards);
            while (computerScore < 17) {
                hitCard(cards, computerCards);
                computerScore = judgeContainedCase(computerCards);
            }

            //topic : 判斷輸贏
            buttonEmbed = new EmbedBuilder().setColor("#ffffff").setTitle(`決戰21點`);
            if (userBomb)
                embedReply(
                    `你爆牌了！ (${userCards.join(", ")})`,
                    buttonEmbed,
                    "#ff0000",
                    "https://media.giphy.com/media/xThtar1NqgCgl3uSmQ/giphy.gif",
                );
            else {
                if (computerScore > 21)
                    embedReply(
                        `電腦爆牌了！ (${computerCards.join(", ")})`,
                        buttonEmbed,
                        "#00ff00",
                        "https://media.giphy.com/media/iUtU5au1bfb5N7XGdh/giphy.gif",
                    );
                else {
                    console.log(userScore, computerScore);
                    if (userScore > computerScore)
                        embedReply(
                            `你贏了！ Computer :${computerCards.join(", ")}`,
                            buttonEmbed,
                            "#00ff00",
                            "https://media.giphy.com/media/2S9Hio4GAGUEZXxUg4/giphy.gif",
                        );
                    else if (userScore < computerScore)
                        embedReply(
                            `你輸了！ Computer :${computerCards.join(", ")}`,
                            buttonEmbed,
                            "ff0000",
                            "https://media.giphy.com/media/lwYxf0qKEjnoI/giphy-downsized-large.gif",
                        );
                    else embedReply(`平手！`, buttonEmbed, "#0000ff");
                }
            }
            async function embedReply(reply, Embed, color = "#ffffff", image = null) {
                Embed.setDescription(reply).setColor(color).setImage(image);
                if (collected.replied) {
                    await collected.followUp({ embeds: [Embed] });
                } else {
                    await collected.reply({ embeds: [Embed] });
                }
            }
            collector.stop();
        });
    },
};
function judgeContainedCase(cards) {
    if (containedA(cards)) {
        const [case1, case2] = [cardCalc(cards, true), cardCalc(cards)];
        if (case1 > 21) return case2;
        else return case1;
    } else return cardCalc(cards);
}
function containedA(cards) {
    let contain = false;
    cards.forEach((card) => {
        const unit = card.slice(1);
        if (unit === "A") {
            contain = true;
        }
    });
    return contain;
}
function cardCalc(cards, AIsEle = false) {
    let score = 0;
    cards.forEach((card) => {
        const unit = card.slice(1);
        switch (unit) {
            case "A":
                if (AIsEle) score += 11;
                else score += 1;
                break;
            case "J":
            case "Q":
            case "K":
                score += 10;
                break;
            default:
                score += Number.parseInt(unit);
                break;
        }
    });
    return score;
}
function hitCard(stack, cards, times = 1) {
    let card;
    for (let i = 0; i < times; i++) {
        card = stack.pop();
        cards.push(card);
    }
    return card;
}

function shuffleArray(array) {
    let currentIndex = array.length,
        temporaryValue,
        randomIndex;

    // While there remain elements to shuffle...
    while (1 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

const fs = require("fs");

function msgAddCount(message) {
    playerid = message.author.id;
    const data = fs.readFileSync("bank.json");
    let bank = JSON.parse(data);

    // find player index in bank with playerid
    let playerIndex = -1;
    let found = 0;
    for (let i = 0; i < bank.length; i++) {
        if (bank[i].ID == playerid) {
            found = 1;
            playerIndex = i;
            break;
        }
    }
    if (found == 0) {
        interaction.reply("找不到玩家");
        return;
    }
    //console.log("found player", bank[playerIndex].ID);

    // compare LatestDailyDate and now timestamp to check daily login

    // now timestamp
    let now = new Date(Date.now());

    // let now, bank[playerIndex].LatestDailyDate in the same format
    let before = new Date(bank[playerIndex].LatestDailyDate);
    let diff = now - before;

    console.log(now, before, diff);
    if (diff > 86400000) {
        bank[playerIndex].Coin += 100;
        message.channel.send(`<@${message.author.id}> 每日登入 +100 金幣！`);
        bank[playerIndex].LatestDailyDate = now;
    }

    // +1 coin every 1 minute
    before = new Date(bank[playerIndex].LatestMsgTime);
    diff = now - before;
    console.log(now, before, diff);
    if (diff > 60000) {
        bank[playerIndex].MsgCount += 1;
        bank[playerIndex].Coin += 1;
        message.react("🪙");
        bank[playerIndex].LatestMsgTime = now;
    }

    // console.log(bank[playerIndex].ID, bank[playerIndex].MsgCount);

    const json = JSON.stringify(bank);
    fs.writeFileSync("bank.json", json);
}

module.exports = {
    msgAddCount,
};

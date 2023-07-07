const fs = require("fs");

function msgAddCount(playerid) {
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

    bank[playerIndex].MsgCount += 1;
    bank[playerIndex].Coin += 1;

    // console.log(bank[playerIndex].ID, bank[playerIndex].MsgCount);

    const json = JSON.stringify(bank);
    fs.writeFileSync("bank.json", json);
}

module.exports = {
    msgAddCount,
};

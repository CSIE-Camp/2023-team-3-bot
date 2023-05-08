const sqlite3 = require("sqlite3").verbose();
const path = require("node:path");
const fs = require("node:fs");

function ValidateDbExists() {
    return fs.existsSync(path.join(__dirname, "mock.db"));
}

function OpenConnection() {
    return new sqlite3.Database(
        path.join(__dirname, "mock.db"),
        sqlite3.OPEN_READWRITE,
        (error) => {
            if (error) {
                return console.error(error);
            }
        },
    );
}

function MigrateJSON() {
    if (!fs.existsSync("players.json")) {
        return console.log("players.json not found, nothing to migrate!");
    }
    const DataToMigrate = fs.readFileSync("players.json");
    const PlayerList = JSON.parse(DataToMigrate);
    const db = OpenConnection();
    for (let i = 0; i < PlayerList.length; i++) {
        const { id, money } = PlayerList[i];
        db.serialize(() => {
            let sql = `
            --你還記得我們怎樣才能把資料 INSERT 進資料表嗎？
            INSERT INTO Players (id, money) VALUES ("${id}", ${money})
            `;
            //怎樣才能執行 SQL指令 🤔
        });
    }
    db.close();
    fs.renameSync("players.json", "ARCHIVED_players.json");
    console.log("Migration completed");
}

function InitDb() {
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        CREATE TABLE IF NOT EXISTS Players(
            --我們的資料表需要什麽欄位呢 🤔 (提示: 看看 players.json)
            id TEXT PRIMARY KEY,
            money INTEGER
        );
        `;
        db.serialize(() => {
            db.exec(sql, (error) => {
                db.close();
                if (error) {
                    console.error(error);
                    return resolve(false);
                }
                console.log("DB initialized");
                MigrateJSON();
                return resolve(true);
            });
        });
    });
}


function AddPlayer(PlayerId, Value){
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        --應該還記得怎樣 INSERT 資料進去吧 🥺
        INSERT INTO Players (id, money) VALUES ("${PlayerId}", ${Value})
        `
        db.exec(sql, (error) => {
            if (error){
                console.error(error);
                return resolve(false);
            }
            return resolve(true);
        })
    })
}


function ListPlayers() {
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        --我們怎樣才能把叫 Players 的資料表上的資料拿出來
        SELECT * FROM Players
        `;
        db.all(sql, (error, Results) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(false);
            }
            return resolve(Results);
        });
    });
}

function SearchPlayer(PlayerId) {
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        --欸欸怎樣才能找到一個某特定的記錄 (提示: I forgot WHERE is my Chinese keyboard)
        SELECT * FROM Players WHERE id = "${PlayerId}"
        `;
        db.all(sql, (error, Results) => {
            db.close();
            if (error) {
                console.error(error);
                return resolve(false);
            }
            return resolve(Results);
        });
    });
}

function UpdatePlayer(PlayerId, NewVal) {
    return new Promise((resolve) => {
        const db = OpenConnection();
        let sql = `
        --怎樣才能 UPDATE 一個記錄 🤔
        UPDATE Players SET money = ${NewVal} WHERE id = "${PlayerId}";
        `;
        db.exec(sql, (error) => {
            if (error) {
                console.error(error);
                return resolve(false);
            }
            return resolve(true);
        });
    });
}

module.exports = {
    ValidateDbExists: ValidateDbExists,
    InitDb: InitDb,
    AddPlayer: AddPlayer,
    ListPlayers: ListPlayers,
    SearchPlayer: SearchPlayer,
    UpdatePlayer: UpdatePlayer,
};

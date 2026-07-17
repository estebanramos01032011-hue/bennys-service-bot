const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

let db;

async function initDatabase() {
    db = await open({
        filename: "./bennys.db",
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS services (
            userId TEXT PRIMARY KEY,
            totalSeconds INTEGER DEFAULT 0
        )
    `);

    console.log("✅ Base de données prête !");
}

module.exports = {
    initDatabase,
    getDb: () => db
};

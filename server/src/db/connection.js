import fs from "node:fs"
import path from "node:path"
import sqlite3 from "sqlite3"

const dbDir = process.env.DB_DIR
const dbFile = process.env.DB_FILE
const dbPath = path.join(dbDir, dbFile)

if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
}

const connection = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ DB Connection Error:", err)
    } else {
        console.log(`✅ Connected to SQLite at ${dbPath}`)
    }
})

export default connection

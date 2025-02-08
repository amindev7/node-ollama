import fs from "fs"
import path from "path"
import sqlite3 from "sqlite3"

const dbDir = process.env.DB_DIR
const dbFile = process.env.DB_FILE
const dbPath = path.join(dbDir, dbFile)

// Ensure the database directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true })
}

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ DB Connection Error:", err)
    } else {
        console.log(`✅ Connected to SQLite at ${dbPath}`)
    }
})

export default db

import DB from "../services/DB.js"

async function initializeDatabase() {
    try {
        await DB.execute(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL
        )`)

        console.log("✅ Database tables initialized")
    } catch (error) {
        console.error("❌ Failed to initialize database:", error)
    }
}

export default initializeDatabase

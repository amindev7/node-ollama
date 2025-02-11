import HttpServer from "./src/services/HttpServer.js"
import auth from "./src/routes/auth.js"
import initializeDatabase from "./src/config/initDB.js"
import model from "./src/routes/model.js"

const PORT = process.env.SERVER_PORT

const server = new HttpServer()

async function startServer() {
    await initializeDatabase()

    // Register routes
    model(server)
    auth(server)

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
}

startServer()

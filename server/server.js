import HttpServer from "./src/core/HttpServer.js"
import auth from "./src/routes/auth.js"
import initializeDB from "./src/db/index.js"
import model from "./src/routes/model.js"

const PORT = process.env.SERVER_PORT

const server = new HttpServer()

async function startServer() {
    await initializeDB()

    // Register routes
    model(server)
    auth(server)

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
}

startServer()

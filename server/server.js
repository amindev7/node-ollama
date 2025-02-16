import { rateLimiter, requestLogger } from "./src/core/middleware.js"

import HttpServer from "./src/core/HttpServer.js"
import OllamaClient from "./src/core/OllamaClient.js"
import auth from "./src/routes/auth.js"
import initializeDB from "./src/db/index.js"
import ollama from "./src/routes/ollama.js"

const PORT = process.env.SERVER_PORT

const server = new HttpServer()
const ollamaClient = new OllamaClient(server)

async function startServer() {
    await initializeDB()

    // Middleware
    server.useMiddleware(requestLogger)
    server.useMiddleware(rateLimiter)

    // Routes
    auth(server)
    ollama(server, ollamaClient)

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
}

startServer()

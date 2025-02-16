import { rateLimiter, requestLogger } from "./src/core/middleware.js"

import HttpServer from "./src/core/HttpServer.js"
import auth from "./src/routes/auth.js"
import initializeDB from "./src/db/index.js"
import ollama from "./src/routes/ollama.js"

const PORT = process.env.SERVER_PORT

const server = new HttpServer()

async function startServer() {
    await initializeDB()

    // Middleware
    server.useMiddleware(requestLogger)
    server.useMiddleware(rateLimiter)

    // Routes
    ollama(server)
    auth(server)

    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`))
}

startServer()

import HttpServer from "./HttpServer.js"
import OllamaClient from "./OllamaClient.js"

const server = new HttpServer()
const ollamaApi = new OllamaClient()

server.get("/", async (req, res) => {
    try {
        const response = await ollamaApi.get("/api/tags")
        res.json(response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch models" })
    }
})

const PORT = process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

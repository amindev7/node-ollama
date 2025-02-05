import HttpServer from "./HttpServer.js"
import OllamaClient from "./OllamaClient.js"

const server = new HttpServer()
const ollamaApi = new OllamaClient()

// list local models
server.get("/", async (req, res) => {
    try {
        const response = await ollamaApi.get("/api/tags")
        res.json(response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch models" })
    }
})

const deepSeek = { model: "deepseek-r1:1.5b" }

// pull modal
server.get("/pull", async (req, res) => {
    try {
        const response = await ollamaApi.post("/api/pull", deepSeek)
        res.json(response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to fetch models" })
    }
})

const prompt = {
    model: "deepseek-r1:1.5b",
    prompt: "Why is the sky blue?",
    stream: false,
}

server.get("/generate", async (req, res) => {
    try {
        const response = await ollamaApi.post("/api/generate", prompt)
        res.json(response)
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to generate response" })
    }
})

const PORT = process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

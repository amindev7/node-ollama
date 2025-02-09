import OllamaClient from "../services/OllamaClient.js"

const ollamaApi = new OllamaClient()
const deepSeek = { model: "deepseek-r1:1.5b" }

export default (server) => {
    server.get("/models", async (req, res) => {
        try {
            const response = await ollamaApi.get("/api/tags")
            res.ok(response)
        } catch (err) {
            console.error(err)
            res.serverError({ error: "Failed to fetch models" })
        }
    })

    server.get("/models/pull", async (req, res) => {
        try {
            const response = await ollamaApi.post("/api/pull", deepSeek)
            res.ok(response)
        } catch (err) {
            console.error(err)
            res.serverError({ error: "Failed to fetch models" })
        }
    })

    const prompt = {
        model: deepSeek.model,
        prompt: "Why is the sky blue?",
        stream: false,
    }

    server.get("/generate", async (req, res) => {
        try {
            const response = await ollamaApi.post("/api/generate", prompt)
            res.ok(response)
        } catch (err) {
            console.error(err)
            res.serverError({ error: "Failed to generate response" })
        }
    })
}

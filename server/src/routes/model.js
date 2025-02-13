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

    server.post("/generate", async (req, res) => {
        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        const prompt = {
            model: deepSeek.model,
            prompt: req.body.prompt,
            stream: true,
        }

        try {
            const responseStream = await ollamaApi.postStream("/api/generate", prompt)

            responseStream.on("data", (chunk) => {
                res.write(`data: ${chunk.toString()}\n\n`)
            })

            responseStream.on("end", () => {
                res.write("event: done\n\n")
                res.end()
            })

            responseStream.on("error", (err) => {
                console.error("Stream error:", err)
                res.write("event: error\ndata: Failed to stream response\n\n")
                res.end()
            })
        } catch (err) {
            console.error(err)
            res.serverError({ error: "Failed to generate response" })
        }
    })
}

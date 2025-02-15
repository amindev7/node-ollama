import OllamaClient from "../services/OllamaClient.js"

const ollamaApi = new OllamaClient()

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
        const model = req.query.model

        if (!model) {
            return res.badRequest({ error: "Model parameter is required" })
        }

        try {
            // Check if the model exists
            // const modelsList = await ollamaApi.get("/api/tags").then((res) => res.json())
            // const modelExists = modelsList.some((m) => m.name === model)

            // if (modelExists) {
            //     return res.ok({ message: "Model already exists", model })
            // }

            const response = await ollamaApi.post("/api/pull", { model })
            res.ok({ model })
        } catch (err) {
            console.error(err)
            res.serverError({ error: "Failed to pull model" })
        }
    })

    server.post("/generate", async (req, res) => {
        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        const model = req.body.model

        if (!model) {
            return res.badRequest({ error: "Model parameter is required" })
        }

        try {
            const prompt = {
                model,
                prompt: req.body.prompt,
                stream: true,
            }

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

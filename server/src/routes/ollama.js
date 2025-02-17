export default (server, ollamaApi) => {
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
            await ollamaApi.post("/api/pull", { model })
            res.ok({ model })
        } catch (err) {
            console.error(err)
            res.serverError({ error: "Failed to pull model" })
        }
    })

    server.post("/chat", async (req, res) => {
        res.setHeader("Content-Type", "text/event-stream")
        res.setHeader("Cache-Control", "no-cache")
        res.setHeader("Connection", "keep-alive")

        const { model, messages } = req.body

        if (!model || !Array.isArray(messages)) {
            return res.badRequest({ error: "Model and messages array are required" })
        }

        try {
            const payload = {
                model,
                messages,
                stream: true,
            }

            const responseStream = await ollamaApi.postStream("/api/chat", payload)

            responseStream.on("data", (chunk) => {
                console.log("Received chunk:", chunk.toString())
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
            res.serverError({ error: "Failed to process chat" })
        }
    })
}

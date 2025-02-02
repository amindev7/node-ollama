import HttpServer from "./HttpServer.js"

const server = new HttpServer()

server.get("/", (req, res) => {
    res.json({ message: "Hello, World!" })
})

const PORT = process.env.PORT

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))

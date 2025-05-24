class OllamaClient {
    constructor(httpServer, host = process.env.OLLAMA_HOST, port = process.env.OLLAMA_PORT) {
        this.httpServer = httpServer
        this.host = host
        this.port = port
    }

    async request(method, path, data = null, headers = {}, isStream = false) {
        const url = `http://${this.host}:${this.port}${path}`

        const options = {
            method,
            headers: {
                "Content-Type": "application/json",
                ...headers,
            },
            body: data ? JSON.stringify(data) : undefined,
        }

        return this.httpServer.fetch(url, options, isStream)
    }

    async post(path, data, headers = {}) {
        return this.request("POST", path, data, headers)
    }

    async postStream(path, data, headers = {}) {
        return this.request("POST", path, data, headers, true)
    }

    async get(path, headers = {}) {
        return this.request("GET", path, null, headers)
    }

    async put(path, data, headers = {}) {
        return this.request("PUT", path, data, headers)
    }

    async _delete(path, headers = {}) {
        return this.request("DELETE", path, null, headers)
    }
}

export default OllamaClient

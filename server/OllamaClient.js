import http from "http"

const OLLAMA_HOST = process.env.OLLAMA_HOST
const OLLAMA_PORT = process.env.OLLAMA_PORT

class OllamaClient {
    constructor(host = OLLAMA_HOST, port = OLLAMA_PORT) {
        this.host = host
        this.port = port
    }

    request(method, path, data = null, headers = {}) {
        return new Promise((resolve, reject) => {
            const options = {
                hostname: this.host,
                port: this.port,
                path,
                method,
                headers: {
                    "Content-Type": "application/json",
                    ...headers,
                },
            }

            const req = http.request(options, (res) => {
                let responseData = ""

                res.on("data", (chunk) => (responseData += chunk))

                res.on("end", () => {
                    try {
                        resolve(JSON.parse(responseData))
                    } catch {
                        resolve(responseData) // Handle non-JSON responses
                    }
                })
            })

            req.on("error", reject)

            if (data) {
                req.write(JSON.stringify(data))
            }

            req.end()
        })
    }

    post(path, data, headers = {}) {
        return this.request("POST", path, data, headers)
    }

    get(path, headers = {}) {
        return this.request("GET", path, null, headers)
    }

    put(path, data, headers = {}) {
        return this.request("PUT", path, data, headers)
    }

    _delete(path, headers = {}) {
        return this.request("DELETE", path, null, headers)
    }
}

export default OllamaClient

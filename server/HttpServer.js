import ResponseWrapper from "./ResponseWrapper.js"
import http from "http"

class HttpServer {
    constructor() {
        this.routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} }
    }

    handleRequest(req, res) {
        const { method, url } = req
        const routeHandler = this.routes[method]?.[url]

        if (!routeHandler) {
            return this.sendResponse(res, 404, { error: "Not Found" })
        }

        if (["POST", "PUT"].includes(method)) {
            return this.parseRequestBody(req, res, (body) => {
                req.body = body
                routeHandler(req, new ResponseWrapper(res))
            })
        }

        routeHandler(req, new ResponseWrapper(res))
    }

    parseRequestBody(req, res, callback) {
        let body = ""

        req.on("data", (chunk) => (body += chunk))

        req.on("end", () => {
            try {
                callback(body ? JSON.parse(body) : {})
            } catch (error) {
                this.sendResponse(res, 400, { error: "Invalid JSON" })
            }
        })
    }

    sendResponse(res, statusCode, data) {
        res.writeHead(statusCode, { "Content-Type": "application/json" })
        res.end(JSON.stringify(data))
    }

    get(route, handler) {
        this.routes.GET[route] = handler
    }

    post(route, handler) {
        this.routes.POST[route] = handler
    }

    listen(port, callback) {
        this.server = http.createServer(this.handleRequest.bind(this))
        this.server.listen(port, callback)
    }
}

export default HttpServer

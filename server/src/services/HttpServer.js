import HttpResponse from "./HttpResponse.js"
import http from "http"
import querystring from "querystring"
import url from "url"

const UI_BASE_URL = `${process.env.UI_URL}:${process.env.UI_PORT}`

class HttpServer {
    constructor() {
        this.routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} }
    }

    handleRequest(req, res) {
        this.setCorsHeaders(res)

        if (req.method === "OPTIONS") {
            return res.writeHead(204).end()
        }

        const parsedUrl = url.parse(req.url, true)
        req.query = parsedUrl.query
        req.pathname = parsedUrl.pathname
        req.params = {}
        req.cookies = this.parseCookies(req)

        const routeHandler = this.matchRoute(req.method, req.pathname)

        if (!routeHandler) {
            return new HttpResponse(res).notFound({ error: "Not Found" })
        }

        if (req.headers.accept === "text/event-stream") {
            // SSE Connection: Keep the response open
            res.setHeader("Content-Type", "text/event-stream")
            res.setHeader("Cache-Control", "no-cache")
            res.setHeader("Connection", "keep-alive")
            res.flushHeaders()
        }

        if (["POST", "PUT"].includes(req.method)) {
            return this.parseRequestBody(req, res, (body) => {
                req.body = body
                routeHandler(req, new HttpResponse(res))
            })
        }

        routeHandler(req, new HttpResponse(res))
    }

    parseCookies(req) {
        const rawCookies = req.headers.cookie || ""

        return rawCookies.split(";").reduce((acc, cookie) => {
            const [key, ...valueParts] = cookie.split("=")
            if (!key || valueParts.length === 0) return acc

            const value = valueParts.join("=").trim()
            acc[key.trim()] = value
            return acc
        }, {})
    }

    setCorsHeaders(res) {
        res.setHeader("Access-Control-Allow-Origin", UI_BASE_URL)
        res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
        res.setHeader("Access-Control-Allow-Credentials", "true")
    }

    matchRoute(method, pathname) {
        return this.routes[method]?.[pathname] || null
    }

    parseRequestBody(req, res, callback) {
        let body = ""

        req.on("data", (chunk) => (body += chunk))

        req.on("end", () => {
            try {
                const contentType = req.headers["content-type"]
                if (contentType === "application/json") {
                    return callback(body ? JSON.parse(body) : {})
                }
                if (contentType === "application/x-www-form-urlencoded") {
                    return callback(querystring.parse(body))
                }

                return callback(body)
            } catch (error) {
                new HttpResponse(res).badRequest({
                    error: "Invalid request body",
                })
            }
        })
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

        process.on("SIGINT", () => {
            this.server.close(() => {
                process.exit(0)
            })
        })
    }
}

export default HttpServer

import { handleSSE, parseCookies, parseRequestBody, setCorsHeaders } from "./utils.js"

import HttpResponse from "./HttpResponse.js"
import http from "node:http"
import url from "node:url"

const UI_BASE_URL = `${process.env.UI_URL}:${process.env.UI_PORT}`

class HttpServer {
    constructor() {
        this.routes = { GET: {}, POST: {}, PUT: {}, DELETE: {} }
        this.middlewares = []
    }

    useMiddleware(middleware) {
        this.middlewares.push(middleware)
    }

    async runMiddlewares(req, res) {
        for (const middleware of this.middlewares) {
            const nextCalled = await new Promise((resolve) => {
                middleware(req, res, () => resolve(true))
                setTimeout(() => resolve(false), 0) // If middleware does not call next, resolve false
            })

            if (!nextCalled) {
                return false
            }
        }
        return true
    }

    async handleRequest(req, res) {
        setCorsHeaders(res, UI_BASE_URL)

        if (req.method === "OPTIONS") {
            return res.writeHead(204).end()
        }

        const parsedUrl = url.parse(req.url, true)
        req.query = parsedUrl.query
        req.pathname = parsedUrl.pathname
        req.params = {}
        req.cookies = parseCookies(req)

        const middlewareSuccess = await this.runMiddlewares(req, res)
        if (!middlewareSuccess) {
            return new HttpResponse(res).forbidden({ error: "Request blocked by middleware" })
        }

        const routeHandler = this.matchRoute(req.method, req.pathname)
        if (!routeHandler) {
            return new HttpResponse(res).notFound({ error: "Route not Found" })
        }

        if (req.headers.accept === "text/event-stream") {
            return handleSSE(req, res)
        }

        if (["POST", "PUT"].includes(req.method)) {
            try {
                await parseRequestBody(req)
            } catch (error) {
                return new HttpResponse(res).badRequest({ error: "Invalid request body" })
            }
        }

        routeHandler(req, new HttpResponse(res))
    }

    async fetch(url, options, isStream = false) {
        return new Promise((resolve, reject) => {
            const { method, headers, body } = options
            const { hostname, port, pathname } = new URL(url)

            const reqOptions = {
                hostname,
                port,
                path: pathname,
                method,
                headers,
            }

            const req = http.request(reqOptions, (res) => {
                if (isStream) return resolve(res)

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

            if (body) {
                req.write(body)
            }

            req.end()
        })
    }

    matchRoute(method, pathname) {
        return this.routes[method]?.[pathname] || null
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

        process.on("SIGINT", () => this.server.close(() => process.exit(0)))
    }
}

export default HttpServer

import HttpResponse from "./HttpResponse.js"

export function parseRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = ""

        req.on("data", (chunk) => (body += chunk))

        req.on("end", () => {
            try {
                const contentType = req.headers["content-type"] || ""

                if (contentType.includes("application/json")) {
                    req.body = body ? JSON.parse(body) : {}
                } else if (contentType.includes("application/x-www-form-urlencoded")) {
                    req.body = Object.fromEntries(new URLSearchParams(body))
                } else {
                    req.body = body // Raw text or other content types
                }

                resolve()
            } catch (error) {
                reject(new Error("Invalid request body"))
            }
        })

        req.on("error", (err) => reject(err))
    })
}

export function parseCookies(req) {
    const rawCookies = req.headers.cookie || ""

    return rawCookies.split(";").reduce((acc, cookie) => {
        const [key, ...valueParts] = cookie.split("=")
        if (!key || valueParts.length === 0) return acc

        const value = valueParts.join("=").trim()
        acc[key.trim()] = value
        return acc
    }, {})
}

export function setCorsHeaders(res, UI_BASE_URL) {
    res.setHeader("Access-Control-Allow-Origin", UI_BASE_URL)
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
    res.setHeader("Access-Control-Allow-Credentials", "true")
}

export function handleSSE(req, res) {
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()
}

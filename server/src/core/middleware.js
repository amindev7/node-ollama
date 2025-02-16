const rateLimit = new Map()

export function rateLimiter(req, res, next) {
    const ip = req.socket.remoteAddress
    const now = Date.now()
    const windowMs = 60000 // 1 min
    const maxRequests = 20

    if (!rateLimit.has(ip)) {
        rateLimit.set(ip, [])
    }

    const requests = rateLimit.get(ip).filter((t) => now - t < windowMs)

    requests.push(now)
    rateLimit.set(ip, requests)

    if (requests.length > maxRequests) {
        res.writeHead(429, { "Content-Type": "application/json" })
        res.end(JSON.stringify({ error: "Too Many Requests" }))
        return false
    }

    return next()
}

export function requestLogger(req, res, next) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`)
    next()
}

class ResponseWrapper {
    constructor(res) {
        this.res = res
        this.statusCode = 200
        this.headers = {}
    }

    setHeader(name, value) {
        this.headers[name] = value
        return this
    }

    json(data) {
        this.res.writeHead(this.statusCode, {
            "Content-Type": "application/json",
            ...this.headers,
        })
        this.res.end(JSON.stringify(data))
    }

    send(data) {
        this.res.writeHead(this.statusCode, {
            "Content-Type": "text/plain",
            ...this.headers,
        })
        this.res.end(data)
    }

    status(code) {
        this.statusCode = code
        return this
    }

    sendResponse(statusCode, data) {
        this.status(statusCode).json(data)
    }
}

export default ResponseWrapper

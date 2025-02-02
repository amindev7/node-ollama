class ResponseWrapper {
    constructor(res) {
        this.res = res
        this.statusCode = 200
    }

    send(data) {
        this.res.writeHead(this.statusCode, { "Content-Type": "text/plain" })
        this.res.end(data)
    }

    json(data) {
        this.res.writeHead(this.statusCode, {
            "Content-Type": "application/json",
        })
        this.res.end(JSON.stringify(data))
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

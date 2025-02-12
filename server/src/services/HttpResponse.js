class HttpResponse {
    constructor(res) {
        this.res = res
        this.headers = {
            "Content-Type": "application/json",
        }
    }

    setHeader(name, value) {
        this.headers[name] = value
    }

    send(status, data) {
        this.res.writeHead(status, this.headers)
        this.res.end(JSON.stringify(data))
    }

    ok(data) {
        return this.send(200, data)
    }

    created(data) {
        return this.send(201, data)
    }

    badRequest(data) {
        return this.send(400, data)
    }

    notFound(data) {
        return this.send(404, data)
    }

    serverError(data) {
        return this.send(500, data)
    }
}

export default HttpResponse

import User from "../models/User.js"
import bcrypt from "bcrypt"
import fs from "fs"
import jwt from "jsonwebtoken"

const PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, "utf8")
const PUBLIC_KEY = fs.readFileSync(process.env.JWT_PUBLIC_KEY_PATH, "utf8")

export default (server) => {
    server.post("/register", async (req, res) => {
        try {
            const email = req.body.email?.trim()
            const password = req.body.password

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                return res.status(400).json({ error: "Invalid email format" })
            }

            const existingUser = await User.getByEmail(email)

            if (existingUser) {
                return res.badRequest({ error: "Email is already registered" })
            }

            const hashedPassword = await bcrypt.hash(password, 12)

            const user = await User.create(email, hashedPassword)

            return res.created({
                message: "User registered successfully",
                userId: user.id,
            })
        } catch (err) {
            console.error(err)
            return res.serverError({ error: "Registration failed" })
        }
    })

    server.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.getByEmail(email)

            if (!user) {
                return res.badRequest({ error: "User not found" })
            }

            if (!password || !user.password) {
                return res.badRequest({ error: "Invalid credentials" })
            }

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                return res.badRequest({ error: "Invalid credentials" })
            }

            const token = jwt.sign({ userId: user.id, email: user.email, app: "node-ollama-v1" }, PRIVATE_KEY, {
                algorithm: "RS256",
                expiresIn: "1h",
            })

            // Set the HTTP-only cookie
            res.setHeader(
                "Set-Cookie",
                `token=${token}; HttpOnly; Path=/; Max-Age=3600; ${process.env.NODE_ENV === "production" ? "Secure; SameSite=Strict" : ""}`
            )

            return res.ok({ message: "Login successful" })
        } catch (err) {
            console.error(err)
            return res.serverError({ error: "Login failed" })
        }
    })

    server.post("/logout", (req, res) => {
        res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0")
        res.ok({ message: "Logged out successfully" })
    })

    server.get("/auth/status", (req, res) => {
        const token = req.cookies?.token

        if (!token) {
            return res.badRequest({ authenticated: false })
        }

        try {
            const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] })
            res.ok({ authenticated: true, user: decoded })
        } catch (error) {
            res.badRequest({ authenticated: false })
        }
    })

    const authenticate = (req, res, next) => {
        const token = req.cookies?.token

        if (!token) {
            return new HttpResponse(res).badRequest({ error: "Unauthorized" })
        }

        try {
            const decoded = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] })
            req.user = decoded
            next()
        } catch (error) {
            return new HttpResponse(res).badRequest({ error: "Invalid or expired token" })
        }
    }

    // server.get("/protected-route", authenticate, (req, res) => {
    //     res.ok({ message: "Welcome!", user: req.user })
    // })
}

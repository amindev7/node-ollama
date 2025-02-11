import User from "../models/User.js"
import bcrypt from "bcrypt"
import fs from "fs"
import jwt from "jsonwebtoken"

const PRIVATE_KEY = fs.readFileSync(process.env.JWT_PRIVATE_KEY_PATH, "utf8")

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

            const token = jwt.sign(
                { userId: user.id, email: user.email, app: "node-ollama-v1" },
                PRIVATE_KEY,
                {
                    algorithm: "RS256",
                    expiresIn: "1h",
                }
            )

            return res.ok({ message: "Login successful", token })
        } catch (err) {
            console.error(err)
            return res.serverError({ error: "Login failed" })
        }
    })
}

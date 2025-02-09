import User from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default (server) => {
    server.post("/register", async (req, res) => {
        try {
            const { email, password } = req.body
            const hashedPassword = await bcrypt.hash(password, 12)
            const user = await User.create(email, hashedPassword)
            res.status(201).json({
                message: "User registered",
                userId: user.id,
            })
        } catch (err) {
            console.error(err)
            res.serverError({ error: "Registration failed" })
        }
    })

    server.post("/login", async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await User.getByEmail(email)

            if (!user) {
                return res.status(400).json({ error: "User not found" })
            }

            const match = await bcrypt.compare(password, user.password)

            if (!match) {
                return res.status(400).json({ error: "Invalid credentials" })
            }

            const token = jwt.sign(
                { userId: user.id },
                process.env.JWT_SECRET,
                { expiresIn: "1h" }
            )

            res.json({ message: "Login successful", token })
        } catch (err) {
            console.error(err)
            res.serverError({ error: "Login failed" })
        }
    })
}

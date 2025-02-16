import HttpResponse from "../core/HttpResponse.js"
import User from "../models/User.js"

const UserController = {
    create: async (req, res) => {
        const response = new HttpResponse(res)
        const { email, password } = req.body

        if (!email || !password) {
            return response.badRequest({
                error: "email, and password are required",
            })
        }

        try {
            const user = await User.create(email, password)
            return response.created({ message: "User created", user })
        } catch (error) {
            return response.serverError({ error: error.message })
        }
    },

    getByEmail: async (req, res) => {
        const response = new HttpResponse(res)
        const { email } = req.params

        try {
            const user = await User.getByEmail(email)
            if (!user) {
                return response.notFound({ error: "User not found" })
            }

            return response.ok(user)
        } catch (error) {
            return response.serverError({ error: error.message })
        }
    },
}

export default UserController

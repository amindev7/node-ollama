import DB from "../services/DB.js"

const User = {
    create: (email, password) => {
        const query = `INSERT INTO users (email, password) VALUES (?, ?)`
        return DB.execute(query, [email, password])
    },

    getAll: () => {
        const query = `SELECT id, email FROM users`
        return DB.findAll(query)
    },

    getById: (id) => {
        const query = `SELECT id, email, password FROM users WHERE id = ?`
        return DB.find(query, [id])
    },

    getByEmail: (email) => {
        const query = `SELECT id, email, password FROM users WHERE email = ?`
        return DB.find(query, [email])
    },
}

export default User

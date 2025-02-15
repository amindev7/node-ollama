import Database from "../db/Database.js"

const User = {
    create: (email, password) => {
        const query = `INSERT INTO users (email, password) VALUES (?, ?)`
        return Database.execute(query, [email, password])
    },

    getAll: () => {
        const query = `SELECT id, email FROM users`
        return Database.findAll(query)
    },

    getById: (id) => {
        const query = `SELECT id, email, password FROM users WHERE id = ?`
        return Database.find(query, [id])
    },

    getByEmail: (email) => {
        const query = `SELECT id, email, password FROM users WHERE email = ?`
        return Database.find(query, [email])
    },
}

export default User

import DBWrapper from "../services/DB.js"

const User = {
    create: (email, password) => {
        const query = `INSERT INTO users (email, password) VALUES (?, ?)`
        return DBWrapper.execute(query, [email, password])
    },

    getAll: () => {
        const query = `SELECT id, email FROM users`
        return DB.findAll(query)
    },

    getById: (id) => {
        const query = `SELECT id, email FROM users WHERE id = ?`
        return DB.find(query, [id])
    },

    getByEmail: (email) => {
        const query = `SELECT id, email FROM users WHERE email = ?`
        return DB.find(query, [email])
    },
}

export default User

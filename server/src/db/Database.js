import db from "./connection.js"

class Database {
    static execute(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.run(sql, params, function (err) {
                if (err) {
                    console.error("❌ SQL Error in execute:", err, {
                        sql,
                        params,
                    })
                    return reject(err)
                }
                resolve({ id: this.lastID, changes: this.changes })
            })
        })
    }

    static find(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.get(sql, params, (err, row) => (err ? reject(err) : resolve(row)))
        })
    }

    static findAll(sql, params = []) {
        return new Promise((resolve, reject) => {
            db.all(sql, params, (err, rows) => (err ? reject(err) : resolve(rows)))
        })
    }

    static close() {
        return new Promise((resolve, reject) => {
            db.close((err) => {
                if (err) {
                    console.error("❌ Error closing DB:", err)
                    return reject(err)
                }
                console.log("✅ Database connection closed")
                resolve()
            })
        })
    }
}

export default Database

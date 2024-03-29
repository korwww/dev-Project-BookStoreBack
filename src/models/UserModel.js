const crypto = require('crypto');
const conn = require('../database/mariadb');

class User {
    constructor(id, email, password, salt) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.salt = salt || crypto.randomBytes(10).toString('base64');
    }

    static async findByEmail(email) {
        const sql = `SELECT * FROM users WHERE email = ?`;
        const [results] = await conn.execute(sql, [email]);
        return results[0] ? new User(results[0].id, results[0].email, results[0].password, results[0].salt) : null;
    }

    async save() {
        const hashPassword = crypto.pbkdf2Sync(this.password, this.salt, 10000, 10, 'sha512').toString('base64');
        const sql = `INSERT INTO users (email, password, salt) VALUES(?, ?, ?)`;
        const values = [this.email, hashPassword, this.salt];
        return await conn.execute(sql, values);
    }

    async updatePassword() {
        const sql = `UPDATE users SET password=?, salt=? WHERE email=?`;
        const values = [this.password, this.salt, this.email];
        return await conn.execute(sql, values);
    }

    verifyPassword(password) {
        const hashPassword = crypto.pbkdf2Sync(password, this.salt, 10000, 10, 'sha512').toString('base64');
        return this.password === hashPassword;
    }

}

module.exports = User;

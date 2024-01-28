const conn = require('../database/mariadb');

class Like {
    static async save(user_id, book_id) {
        let sql = `INSERT INTO likes(user_id, liked_book_id) VALUES (?, ?);`;
        let values = [user_id, book_id];

        return await conn.query(sql, values);
    }

    static async delete(user_id, book_id) {
        let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
        let values = [user_id, book_id];

        return await conn.execute(sql, values);
    }
}

module.exports = Like;

const conn = require('../database/mariadb');

class Like {
    static async save(user_id, book_id){
        let sql = `INSERT INTO likes(user_id, liked_book_id) VALUES (?, ?);`;
        let values = [user_id, book_id];

        return await conn.query(sql, values);
    }
}

module.exports = Like;

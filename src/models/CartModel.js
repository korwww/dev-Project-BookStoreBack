const conn = require('../database/mariadb');

class Cart {
    constructor(book_id, quantity, user_id) {
        this.book_id = book_id;
        this.quantity = quantity;
        this.user_id = user_id;
    }

    async save(){
        let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
        let values = [this.book_id, this.quantity, this.user_id];

        return await conn.execute(sql, values);
    }

    static checkSelected(selected, values){
        if(selected){
            values.push(selected);
            return ` AND c.id IN (?)`;
        }
        return '';
    }

    static async getcartItems(user_id, selected){
        let sql = `SELECT c.id, book_id AS bookId, title, summary, quantity, price
        FROM cartItems c LEFT JOIN books b
        ON c.book_id=b.id
        WHERE user_id = ?`

        let values = [user_id];

        sql += this.checkSelected(selected, values);
        sql += `;`;
        
        return await conn.execute(sql, values);
    }

    static async delete(cartItemId){
        let sql = `DELETE FROM cartItems WHERE id = ?;`;
        return await conn.execute(sql, [cartItemId]);
    }
}

module.exports = Cart;

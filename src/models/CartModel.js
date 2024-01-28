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
}

module.exports = Cart;

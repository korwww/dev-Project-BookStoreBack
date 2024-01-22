const conn = require('../database/mariadb');

class Order {
    constructor(userId, items, delivery, firstBookTitle, totalQuantity, totalPrice) {
        this.userId = userId;
        this.items = items;
        this.delivery = delivery;
        this.firstBookTitle = firstBookTitle;
        this.totalQuantity = totalQuantity;
        this.totalPrice = totalPrice;
    }

    static async findById(id) {
        const sql = `SELECT * FROM orders WHERE id = ?`;
        const [results] = await conn.query(sql, id);
        return results[0] ? new Order(results[0].userId, results[0].items, results[0].delivery, results[0].firstBookTitle, results[0].totalQuantity, results[0].totalPrice) : null;
    }

    static async findByUserId(userId) {
        const sql = `SELECT * FROM orders WHERE user_id = ?`;
        let [results] = await conn.query(sql, userId);
        return results;
    }

    async save() {
        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES(?, ?, ?);`;
        let values = [this.delivery.address, this.delivery.receiver, this.delivery.contact];
        let [results] = await conn.execute(sql, values);
        let orderId = results.insertId;
        
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id) VALUES(?, ?, ?, ?, ?);`
        values = [this.firstBookTitle, this.totalQuantity, this.totalPrice, this.userId, orderId];
        await conn.execute(sql, values);

        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        let [orderItems] = await conn.query(sql, [this.items]);

        sql = `INSERT INTO orderedBook(order_id, book_id, quantity) VALUES ?;`;
        values = [];

        orderItems.forEach((item) =>
            values.push([orderId, item.book_id, item.quantity])
        );
 
        try {
            results = await conn.query(sql, [values]);
        } catch (err) {
            console.log(err);
        }

        return orderId;
    }

    async deleteCartItems() {
        let sql = `DELETE FROM cartItems WHERE id IN (?);`;
        let [result] = await conn.query(sql, [this.items]);
        return result;
    }
}

module.exports = Order;

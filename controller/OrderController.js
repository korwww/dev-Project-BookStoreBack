const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const orderController = {
    order: async (req, res) => {
        const conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'BookShop',
            dateStrings: true
        });

        const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES(?, ?, ?);`;
        let values = [delivery.address, delivery.receiver, delivery.contact];
        let [results] = await conn.execute(sql, values);
        let delivery_id = results.insertId;
        
        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
                VALUES(?, ?, ?, ?, ?);`
        values = [firstBookTitle, totalQuantity, totalPrice, userId, delivery_id];
        [results] = await conn.execute(sql, values);

        sql = `INSERT INTO orderedBook(order_id, book_id, quantity) VALUES ?;`
        values = [];
        items.forEach((item) =>
            values.push([order_id, item.book_id, item.quantity])
        );
        results = await conn.execute(sql, [values]);

        return res.status(StatusCodes.OK).json(results[0]);
    },
    getOrders: (req, res) => {
        res.status(200).json('주문 목록 조회');
    },
    getOrderDetail: (req, res) => {
        const orderId = req.params.orderId;
        res.status(200).json('주문 상세 상품 조회');
    }
}

module.exports = Object.freeze(orderController);

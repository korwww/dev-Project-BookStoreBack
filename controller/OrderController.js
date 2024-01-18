const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');

const deleteCartItems = async (conn, items) => {
    let sql = `DELETE FROM cartItems WHERE id IN (?);`;

    let [result] = await conn.query(sql, [items]);
    return result;
}

const orderController = {
    order: async (req, res) => {
        const conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'BookShop',
            dateStrings: true
        });

        const { items, delivery, firstBookTitle, totalQuantity, totalPrice, userId } = req.body;

        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES(?, ?, ?);`;
        let values = [delivery.address, delivery.receiver, delivery.contact];
        let [results] = await conn.execute(sql, values);
        let order_id = results.insertId;

        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
                VALUES(?, ?, ?, ?, ?);`
        values = [firstBookTitle, totalQuantity, totalPrice, userId, order_id];
        [results] = await conn.execute(sql, values);

        sql = `SELECT book_id, quantity FROM cartItems WHERE id IN (?)`;
        let [orderItems, fileds] = await conn.query(sql, [items]);

        sql = `INSERT INTO orderedBook(order_id, book_id, quantity) VALUES ?;`;
        values = [];
        orderItems.forEach((item) =>
            values.push([order_id, item.book_id, item.quantity])
        );

        try{
            results = await conn.query(sql, [values]);
        }catch(err){
            console.log("삽입 실패! cartItem이 없어 null값이 들어가므로 not null 제약에 의해 에러");
        }

        let result = await deleteCartItems(conn, items);
        return res.status(StatusCodes.OK).json(result);
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

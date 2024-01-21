const conn = require('../mariadb');
const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const ensureAuthorization = require('../auth');


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
        
        const authorization = ensureAuthorization(req);

        if(authorization instanceof jwt.TokenExpiredError){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message" : "로그인 세션 만료. 다시 로그인하세요."
            });
        } else if (authorization instanceof jwt.JsonWebTokenError){
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message" : "잘못된 토큰."
            });
        }

        const user_id = authorization.id;

        const { items, delivery, firstBookTitle, totalQuantity, totalPrice } = req.body;

        let sql = `INSERT INTO delivery (address, receiver, contact) VALUES(?, ?, ?);`;
        let values = [delivery.address, delivery.receiver, delivery.contact];
        let [results] = await conn.execute(sql, values);
        let order_id = results.insertId;

        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
                VALUES(?, ?, ?, ?, ?);`
        values = [firstBookTitle, totalQuantity, totalPrice, user_id, order_id];
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
    getOrders: async (req, res) => {
        const conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'BookShop',
            dateStrings: true
        });
        let sql = `select orders.id, created_at, address, receiver, contact,
                    book_title, total_Price, total_quantity
                    from BookShop.orders LEFT JOIN BookShop.delivery
                    on orders.delivery_id = delivery.id;`
        let [rows, fields] = await conn.query(sql);
        return res.statuscodes(StatusCodes.OK).json(rows);
    },
    getOrderDetail: async (req, res) => {
        const {orderId} = req.params;
        
        const conn = await mariadb.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'BookShop',
            dateStrings: true
        });
        let sql = `select book_id, title, author, price, quantity
                    from BookShop.orderedBook LEFT JOIN BookShop.books
                    on orderedBook.book_id = books.id
                    WHERE order_id = ?;`
        let [rows, fields] = await conn.query(sql, [orderId]);
        return res.statuscodes(StatusCodes.OK).json(rows);
    }
}

module.exports = Object.freeze(orderController);

const conn = require('../database/mariadb');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ensureAuthorization = require('../midlewares/auth');

const cartController = {
    addItemsToCart: async (req, res) => {
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

        const { book_id, quantity } = req.body;

        let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
        let values = [book_id, quantity, user_id];

        try {
            const results = await conn.query(sql, values);
            return res.status(StatusCodes.CREATED).json(results);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    getCartItems: async (req, res) => {
        const authorization = ensureAuthorization(req);

        if(authorization instanceof jwt.TokenExpiredError){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message" : "로그인 세션 만료. 다시 로그인하세요."
            });
        }
        if (authorization instanceof jwt.JsonWebTokenError){
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message" : "잘못된 토큰."
            });
        }
        const user_id = authorization.id;
        
        const { selected } = req.body;
      
        let sql = `SELECT c.id, book_id AS bookId, title, summary, quantity, price
        FROM cartItems c LEFT JOIN books b
        ON c.book_id=b.id
        WHERE user_id = ?`

        let values = [user_id];
        if(selected){
            sql += ` AND c.id IN (?)`;
            values.push(selected);
        }
        sql += `;`;

        try {
            const results = await conn.query(sql, values);
            return res.status(StatusCodes.OK).json(results);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    removeCartItems: async (req, res) => {
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

        const cartItemId = req.params.id;
        
        let sql = `DELETE FROM cartItems WHERE id = ?;`;
        try {
            const results = await conn.query(sql, cartItemId);
            return res.status(StatusCodes.OK).json(results);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}

module.exports = Object.freeze(cartController);

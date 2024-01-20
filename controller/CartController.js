const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const dotenv = require('dotenv');
dotenv.config();

const cartController = {
    addItemsToCart: (req, res) => {
        const { book_id, quantity } = req.body;
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
        let sql = `INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);`;
        let values = [book_id, quantity, user_id];

        conn.query(sql, values,
            function (err, results) {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.CREATED).json(results);
            }
        );
    },
    getCartItems: (req, res) => {
        const { selected } = req.body;
        const user_id  = ensureAuthorization(req).id;

        let sql = `SELECT c.id, book_id, title, summary, quantity, price
                    FROM cartItems c LEFT JOIN books b
                    ON c.book_id=b.id
                    WHERE user_id = ? AND c.id IN (?);`;

        conn.query(sql, [user_id, selected],
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.OK).json(results);
            }
        );
    },
    removeCartItems: (req, res) => {
        const {cartItemId} = req.params;
        
        let sql = `DELETE FROM cartItems WHERE id = ?;`;
        conn.query(sql, cartItemId,
            function (err, results) {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.OK).json(results);
            }
        );
    }
}

const ensureAuthorization = (req) => {
    try{
        const { authorization: receivedJwt } = req.headers;

        let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
        return decodedJwt;
    } catch (err) {
        console.log(err.name);
        console.log(err.message);

        return err;
    }
}

module.exports = Object.freeze(cartController);

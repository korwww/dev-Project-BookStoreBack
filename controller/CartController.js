const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const cartController = {
    addItemsToCart: (req, res) => {
        const { book_id, quantity, user_id } = req.body;
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

        let sql = `SELECT c.id, book_id, title, summary, quantity, price
        FROM cartItems c LEFT JOIN books b
        ON c.book_id=b.id
        WHERE user_id = ?`

        let values = [user_id];
        if(selected){
            sql += ` AND c.id IN (?)`;
            values.push(selected);
        }
        sql += `;`;

        conn.query(sql, values,
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
        const {id} = req.params;
        let sql = `DELETE FROM cartItems WHERE id = ?;`;
        conn.query(sql, bookId,
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

module.exports = Object.freeze(cartController);

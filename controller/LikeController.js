const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const dotenv = require('dotenv');
dotenv.config();

const ensureAuthorization = (req) => {
    const { authorization: receivedJwt } = req.headers;

    let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);
    return decodedJwt;
}

const likeController = {
    addLike: (req, res) => {
        const { booksId } = req.params;

        const userId  = ensureAuthorization(req).id;

        let sql = `INSERT INTO likes(user_id, liked_book_id) VALUES (?, ?);`;
        let values = [userId, booksId];
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
    removeLike: (req, res) => {
        const { bookId } = req.params;

        const userId  = ensureAuthorization(req).id;

        let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
        
        let values = [userId, bookId];
        conn.query(sql, values,
            function (err, results) {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                return res.status(StatusCodes.CREATED).json(results);
            }
        );
    }
}

module.exports = Object.freeze(likeController);

const conn = require('../mariadb');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');

const dotenv = require('dotenv');
dotenv.config();

const likeController = {
    addLike: (req, res) => {
        const { booksId } = req.params;

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

        const userId = authorization.id;

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

module.exports = Object.freeze(likeController);

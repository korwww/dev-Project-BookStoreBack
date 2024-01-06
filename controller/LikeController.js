const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const likeController = {
    addLike: (req, res) => {
        let sql = `INSERT INTO likes(user_id, liked_book_id) VALUES (?, ?);`;
        let values = [1, req.params.booksId];
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
        let sql = `DELETE FROM likes WHERE user_id = ? AND liked_book_id = ?;`;
        let values = [1, req.params.booksId];
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

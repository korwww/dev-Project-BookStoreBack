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
        res.status(200).json('좋아요 삭제');
    }
}

module.exports = Object.freeze(likeController);

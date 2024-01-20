const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const ensureAuthorization = require('../auth');

const bookController = {
    getBooksByCategory: (req, res) => {
        const { categoryId, isNew, limit, currentPage } = req.query;

        let offset = limit * (currentPage-1);

        let sql = `SELECT *, (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes FROM books`;
        let values = [];
        let conditions = [];
        
        if (categoryId) {
            conditions.push(`category_id = ?`);
            values.push(categoryId);
        }
        if (String(isNew).toLowerCase() === "true") {
            conditions.push(`pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`);
        }
        if (conditions.length > 0) {
            sql += ` WHERE ` + conditions.join(` AND `);
        }
        sql += ` LIMIT ? OFFSET ?`;
        values.push(parseInt(limit), offset);

        console.log(require('mysql2').format(sql, values));
        conn.query(sql, values,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                if (results.length) return res.status(StatusCodes.OK).json(results);
                else return res.status(StatusCodes.NOT_FOUND).end();
            }
        );
    },
    getSingleBook: (req, res) => {
        let booksId = req.params.booksId;
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

        let sql = `SELECT *, 
                    (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes,
                    (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked
                    FROM books
                    LEFT JOIN category
                    ON books.category_id = category.category_id
                    WHERE books.id=?;`;
        let values = [user_id, booksId, booksId]        

        conn.query(sql, values,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
                else return res.status(StatusCodes.NOT_FOUND).end();
            }
        );
    }
}

module.exports = Object.freeze(bookController);

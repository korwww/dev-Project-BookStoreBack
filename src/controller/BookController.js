const conn = require('../database/mariadb');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ensureAuthorization = require('../midlewares/auth');

const bookController = {
    getAllBooks: async (req, res) => {
        const { categoryId, isNew, limit, currentPage = 1 } = req.query;

        let offset = limit * (currentPage - 1);

        let sql = `SELECT id, title, img, summary, author, price, (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes, pub_date AS pubDate FROM books`;
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
        if (limit) {
            sql += ` LIMIT ? `;
            values.push(parseInt(limit));
        }
        if (offset) {
            sql += `OFFSET ?`;
            values.push(parseInt(limit));
        }
        sql += `;`;

        let response = {};
        try {
            const [results] = await conn.query(sql, values);
            response.books = results;

            sql = `SELECT count(*) AS total_count FROM books`;
            const [countResults] = await conn.query(sql);

            let pagination = {};
            pagination.currentPage = parseInt(currentPage);
            pagination.totalCount = countResults[0]["total_count"];
            response.pagination = pagination;

            return res.status(StatusCodes.OK).json(response);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    getSingleBook: async (req, res) => {
        let booksId = req.params.id;
        const authorization = ensureAuthorization(req);

        let sql = `SELECT books.id, books.title, img, category.category_name AS categoryName, isbn, summary, detail, author, pages, contents, price,
                   (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes `;
        let values = [];

        if (authorization instanceof jwt.TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message": "로그인 세션 만료. 다시 로그인하세요."
            });
        } else if (authorization instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message": "잘못된 토큰."
            });
        } else if (authorization instanceof ReferenceError) {

        } else {
            sql += `, (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked `;
            values.push(authorization.id);
        }
        values.push(booksId, booksId);

        sql += `, pub_date AS pubDate
                FROM books
                LEFT JOIN category
                ON books.category_id = category.category_id
                WHERE books.id=?;`;

        try {
            const [results] = await conn.query(sql, values);
            if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
            else return res.status(StatusCodes.NOT_FOUND).end();
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}

module.exports = Object.freeze(bookController);

const conn = require('../database/mariadb');
const jwt = require('jsonwebtoken');


const ensureAuthorization = require('../midlewares/auth');
const { StatusCodes } = require('http-status-codes');
const BookService = require('../services/BookService');

const BookController = {
    getAllBooks: async (req, res) => {
        const { categoryId, isNew, limit, currentPage = 1 } = req.query;

        let response = {};
        try {
            response.books = await BookService.getBooks(categoryId, isNew, limit, currentPage);

            response.pagination = await BookService.createPagination(currentPage);

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

module.exports = Object.freeze(BookController);

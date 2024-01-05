const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const bookController = {
    selectAllBooks: (req, res) => {
        let sql = `SELECT id, title, summary, author, price, pub_date FROM books`;

        conn.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
        );
    },

    selectBooksByCategory: (req, res, next) => {
        const { categoryId, isNew } = req.query;
        if (!categoryId) return next();

        let sql = `SELECT id, title, summary, author, price, pub_date FROM books WHERE category_id = ?`;

        conn.query(sql, categoryId,
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

    selectSingleBook: (req, res) => {
        let booksId = req.params.booksId;

        let sql = `select * from books
                   left join category on books.category_id = category.id
                   where books.id=?;`;

        conn.query(sql, booksId,
            (err, results) => {
                if (err) {
                    console.log(err);
                    return res.status(StatusCodes.BAD_REQUEST).end();
                }

                if (results[0]) return res.status(StatusCodes.OK).json(results[0]);
                else return res.status(StatusCodes.NOT_FOUND).end();
            }
        );
    },
}

module.exports = Object.freeze(bookController);

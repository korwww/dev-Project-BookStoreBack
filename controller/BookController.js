const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const bookController = {
    selectBooksByCategory: (req, res) => {
        const { categoryId, isNew, limit, currentPage } = req.query;

        let offset = limit * (currentPage-1);

        let sql = `SELECT * FROM books`;
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
    }
}

module.exports = Object.freeze(bookController);

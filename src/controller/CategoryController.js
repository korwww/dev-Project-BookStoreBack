const conn = require('../database/mariadb');
const {StatusCodes} = require('http-status-codes');

const allCategory = (req, res) => {
    let sql = `SELECT category_id AS categoryId, category_name AS categoryName FROM category`;

    conn.query(sql, (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
    );
};

module.exports = {allCategory};

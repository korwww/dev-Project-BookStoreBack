const conn = require('../database/mariadb');
const {StatusCodes} = require('http-status-codes');

const allCategory = async (req, res) => {
    let sql = `SELECT category_id AS categoryId, category_name AS categoryName FROM category`;

    try {
        const [results] = await conn.query(sql);
        return res.status(StatusCodes.OK).json(results);
    } catch (err) {
        console.log(err);
        return res.status(StatusCodes.BAD_REQUEST).end();
    }
};

module.exports = {allCategory};

const conn = require('../database/mariadb');

class Book {
    // constructor(sql, bookState){
    //     this.sql = sql;
    //     this.bookState = bookState || 
    //     {
            
    //     };
    // }

    // checkCategoryId(categoryId, values, conditions) {
    //     if (categoryId) {
    //         conditions.push(`category_id = ?`);
    //         values.push(categoryId);
    //     }
    // }

    // checkIsNew(isNew, conditions) {
    //     if (String(isNew).toLowerCase() === "true") {
    //         conditions.push(`pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`);
    //     }
    // }

    // addWhereQuery(conditions){
    //     if (conditions.length > 0) {
    //         return ` WHERE ` + conditions.join(` AND `);
    //     }
    //     return '';
    // }

    // checkLimit(limit, values) {
    //     if (limit) {
    //         values.push(parseInt(limit));
    //         return ` LIMIT ? `;
    //     }
    // }

    // checkOffset(offset, values) {
    //     if (offset) {
    //         values.push(parseInt(limit));
    //         return `OFFSET ?`;
    //     }
    // }

    // async getBooks () {
    //     const { categoryId, isNew, limit, currentPage = 1 } = req.query;


    //     let sql = `SELECT id, title, img, summary, author, price, (SELECT count(*) FROM likes WHERE books.id = liked_book_id) AS likes, pub_date AS pubDate FROM books`;
    //     let values = [];
    //     let conditions = [];

    //     checkCategoryId(categoryId, values, conditions);

    //     isNew(isNew, values, conditions);

    //     sql += this.addWhereQuery(conditions);

    //     sql += checkLimit(limit, values);

    //     let offset = limit * (currentPage - 1);
    //     sql += checkOffset(offset, values);

    //     sql += `;`;

    //     return await conn.query(sql, values);
    // }

}

module.exports = Book;

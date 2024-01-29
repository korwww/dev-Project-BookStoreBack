const conn = require('../database/mariadb');

class Book {
    constructor(categoryId, isNew, limit, currentPage) {
        this.categoryId = categoryId;
        this.isNew = isNew;
        this.limit = limit;
        this.currentPage = currentPage;
    }

    checkCategoryId(values, conditions) {
        if (this.categoryId) {
            conditions.push(`category_id = ?`);
            values.push(this.categoryId);
        }
    }

    checkIsNew(conditions) {
        if (String(this.isNew).toLowerCase() === "true") {
            conditions.push(`pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()`);
        }
    }

    addWhereQuery(conditions) {
        if (conditions.length > 0) {
            return ` WHERE ` + conditions.join(` AND `);
        }
        return '';
    }

    checkLimit(values) {
        if (this.limit) {
            values.push(parseInt(this.limit));
            return ` LIMIT ?`;
        }
        return '';
    }

    checkCurrentPage(values) {
        if (this.limit * (this.currentPage - 1)) {
            values.push(parseInt(this.limit));
            return ` OFFSET ?`;
        }
        return '';
    }

    async findBooksByQuery() {
        let sql = `
                    SELECT id, title, img, summary, author, price, (SELECT count(*) 
                    FROM likes WHERE books.id = liked_book_id) AS likes, pub_date AS pubDate 
                    FROM books`;
        let values = [];
        let conditions = [];

        this.checkCategoryId(values, conditions);

        this.checkIsNew(values, conditions);

        sql += this.addWhereQuery(conditions);

        sql += this.checkLimit(values);

        sql += this.checkCurrentPage(values);

        sql += `;`;

        return await conn.execute(sql, values);
    }

    static async getTotalCount() {
        let sql = `SELECT count(*) AS total_count FROM books`;

        return await conn.execute(sql);
    }

    static async findBooksById(bookId, isLogin, userId) {
        let sql = `SELECT books.id, books.title, img, category.category_name AS categoryName, isbn, summary, detail, author, pages, contents, price,
                   (SELECT count(*) FROM likes WHERE liked_book_id=books.id) AS likes `;
        let values = [];
    
        if(isLogin){
            sql += `, (SELECT EXISTS (SELECT * FROM likes WHERE user_id=? AND liked_book_id=?)) AS liked `;
            values.push(userId, bookId);
        }
    
        values.push(bookId);
    
        sql += `, pub_date AS pubDate
                FROM books
                LEFT JOIN category
                ON books.category_id = category.category_id
                WHERE books.id=?;`;
        return await conn.execute(sql, values);
    }
}

module.exports = Book;

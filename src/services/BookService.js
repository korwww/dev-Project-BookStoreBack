const Book = require('../models/BookModel');

const BookService = {
    async getBooks(categoryId, isNew, limit, currentPage) {
        const bookList = new Book(categoryId, isNew, limit, currentPage);
        [results] = await bookList.findBooksByQuery();

        return results;
    },
    async createPagination(currentPage) {
        const [countResults] = await Book.getTotalCount();

        let pagination = {};
        pagination.currentPage = parseInt(currentPage);
        pagination.totalCount = countResults[0]["total_count"];

        return pagination;
    }
}

module.exports = Object.freeze(BookService);

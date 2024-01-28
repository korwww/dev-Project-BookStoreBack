const Book = require('../models/BookModel');

const BookService = {
    async getBooks(categoryId, isNew, limit, currentPage) {
        const bookList = new Book(categoryId, isNew, limit, currentPage);
        const [results] = await bookList.findBooksByQuery();

        return results;
    },
    async createPagination(currentPage) {
        const [countResults] = await Book.getTotalCount();

        let pagination = {};
        pagination.currentPage = parseInt(currentPage);
        pagination.totalCount = countResults[0]["total_count"];

        return pagination;
    },
    async getBookById(bookId) {
        const [results] = await Book.findBooksById(bookId);
        return results[0];
    }
}

module.exports = Object.freeze(BookService);

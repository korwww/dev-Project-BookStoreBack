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
        let bookId = req.params.id;
        //const authorization = ensureAuthorization(req);
        try {
            let results = await BookService.getBookById(bookId);
            if (results) return res.status(StatusCodes.OK).json(results);
            else return res.status(StatusCodes.NOT_FOUND).end();
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}

module.exports = Object.freeze(BookController);

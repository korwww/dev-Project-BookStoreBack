const {ensureAuthorization, handleAuthError} = require('../midlewares/auth');
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
        let isLogin = false;
        let user_id;
        try {
            const authorization = ensureAuthorization(req);
            user_id = authorization.id;
            isLogin = true;
        } catch (err) {
            if (!(err instanceof ReferenceError)) {
                return handleAuthError(res, err);
            }
        }
    
        try {
            let results = await BookService.getBookById(bookId, isLogin, user_id);
            if (results) return res.status(StatusCodes.OK).json(results);
            else return res.status(StatusCodes.NOT_FOUND).end();
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}

module.exports = Object.freeze(BookController);

const { StatusCodes } = require('http-status-codes');
const {ensureAuthorization, authErrorHandler} = require('../midlewares/auth');
const CartService = require('../services/CartService');

const cartController = {
    addItemsToCart: async (req, res) => {
        let user_id;
        try {
            const authorization = ensureAuthorization(req);
            user_id = authorization.id;
        } catch (err) {
            return handleAuthError(res, err);
        }

        const { book_id, quantity } = req.body;

        try {
            const results = await CartService.insertItems(book_id, quantity, user_id);
            return res.status(StatusCodes.CREATED).json(results);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    getCartItems: async (req, res) => {
        let user_id;
        try {
            const authorization = ensureAuthorization(req);
            user_id = authorization.id;
        } catch (err) {
            return handleAuthError(res, err);
        }

        const { selected } = req.body;

        try {
            const results = await CartService.getItems(user_id, selected);
            return res.status(StatusCodes.OK).json(results);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    removeCartItems: async (req, res) => {
        try {
            ensureAuthorization(req);
        } catch (err) {
            return handleAuthError(res, err);
        }

        const cartItemId = req.params.id;

        try {
            const results = await CartService.removeCartItems(cartItemId);
            return res.status(StatusCodes.OK).json(results);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}

module.exports = Object.freeze(cartController);

const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const ensureAuthorization = require('../midlewares/auth');
const CartService = require('../services/CartService');

const cartController = {
    addItemsToCart: async (req, res) => {
        const authorization = ensureAuthorization(req);

        if(authorization instanceof jwt.TokenExpiredError){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message" : "로그인 세션 만료. 다시 로그인하세요."
            });
        } else if (authorization instanceof jwt.JsonWebTokenError){
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message" : "잘못된 토큰."
            });
        }
        const user_id = authorization.id;

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
        const authorization = ensureAuthorization(req);

        if(authorization instanceof jwt.TokenExpiredError){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message" : "로그인 세션 만료. 다시 로그인하세요."
            });
        }
        if (authorization instanceof jwt.JsonWebTokenError){
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message" : "잘못된 토큰."
            });
        }
        const user_id = authorization.id;
        
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
        const authorization = ensureAuthorization(req);

        if(authorization instanceof jwt.TokenExpiredError){
            return res.status(StatusCodes.UNAUTHORIZED).json({
                "message" : "로그인 세션 만료. 다시 로그인하세요."
            });
        } else if (authorization instanceof jwt.JsonWebTokenError){
            return res.status(StatusCodes.BAD_REQUEST).json({
                "message" : "잘못된 토큰."
            });
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

const { StatusCodes } = require('http-status-codes');
const {ensureAuthorization, handleAuthError} = require('../midlewares/auth');
const LikeService = require('../services/LikeService');

const likeController = {
    addLike: async (req, res) => {
        const book_id = req.params.id;
        let user_id;
        try {
            const authorization = ensureAuthorization(req);
            user_id = authorization.id;
        } catch (err) {
            return handleAuthError(res, err);
        }

        try {
            const results = await LikeService.addLike(user_id, book_id);
            return res.status(StatusCodes.CREATED).json(results);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    removeLike: async (req, res) => {
        const book_id = req.params.id;
        let user_id;
        try {
            const authorization = ensureAuthorization(req);
            user_id = authorization.id;
        } catch (err) {
            return handleAuthError(res, err);
        }

        try {
            const results = await LikeService.removeLike(user_id, book_id);
            return res.status(StatusCodes.CREATED).json(results);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}

module.exports = Object.freeze(likeController);

const { body, param, validationResult } = require('express-validator');
const {StatusCodes} = require('http-status-codes');

const validateErrorHandler = (req, res, next) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
        return next();
    }
    return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

module.exports = validateErrorHandler;

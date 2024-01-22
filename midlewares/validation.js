const { body, param, validationResult } = require('express-validator');
const {StatusCodes} = require('http-status-codes');

const validateErrorHandler = (req, res, next) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
        return next();
    }
    return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

const checkEmail = () => body('email').notEmpty().isString().isEmail().withMessage('이메일 확인 필요!');

const checkPassword = () => body('password').notEmpty().isString().withMessage('비밀번호 확인 필요!');

module.exports = {
    validateErrorHandler,
    checkEmail,
    checkPassword
}


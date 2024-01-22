const { body, param, validationResult } = require('express-validator');
const validatePassword = require('../utils/validatePassword')
const {StatusCodes} = require('http-status-codes');

const validateErrorHandler = (req, res, next) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
        return next();
    }
    return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

const checkBodyEmail = () => 
    body('email')
    .notEmpty()
    .withMessage('이메일은 필수 입력 항목입니다.')
    .isString()
    .withMessage('이메일은 문자열 형태로 입력되어야 합니다.')
    .isEmail()
    .withMessage('이메일 형식이 올바르지 않습니다');

const checkBodyPassword = () => 
body('password')
.notEmpty()
.withMessage('비밀번호는 필수 입력 항목입니다.')
.isString()
.withMessage('비밀번호는 문자열 형태로 입력되어야 합니다.')
.custom((value) => {
    const passwordOptions = {
        length:   [parseInt(process.env.PASSWORD_LENGTH_MIN), parseInt(process.env.PASSWORD_LENGTH_MAX)],
        lower:    parseInt(process.env.PASSWORD_LOWER),
        upper:    parseInt(process.env.PASSWORD_UPPER),
        numeric:  parseInt(process.env.PASSWORD_NUMERIC),
        special:  parseInt(process.env.PASSWORD_SPECIAL),
        badWords: process.env.PASSWORD_BAD_WORDS.split(','),
        badSequenceLength: parseInt(process.env.PASSWORD_BAD_SEQUENCE_LENGTH)
    };
    
    if (!validatePassword(value, passwordOptions)) {
        throw new Error(
        `
        1.비밀번호의 길이는 최소 6자 이상, 최대 16자 이하여야 합니다.
        2.비밀번호는 최소한 하나의 소문자를 포함해야 합니다.
        3.비밀번호는 최소한 하나의 숫자를 포함해야 합니다.
        6.'password', 'steven', 'levithan'과 같은 단어를 비밀번호에 포함하면 안 됩니다.
        7.10글자 이상의 연속된 문자나 숫자를 포함하면 안 됩니다.
        `);
    }

    return true;
});

module.exports = {
    validateErrorHandler,
    checkBodyEmail,
    checkBodyPassword
}

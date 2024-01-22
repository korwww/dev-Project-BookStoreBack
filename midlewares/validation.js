const { body, param, validationResult, query } = require('express-validator');
const validatePassword = require('../utils/validatePassword')
const { StatusCodes } = require('http-status-codes');

const validateErrorHandler = (req, res, next) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
        return next();
    }
    return res.status(StatusCodes.BAD_REQUEST).json(err.array());
}

const checkAllowedQueryParams = () => {
    const allowedParams = ['limit', 'currentPage', 'categoryId', 'isNew'];
    return query().custom((value, { req }) => {
        const queryParams = Object.keys(req.query);
        for (let param of queryParams) {
            if (!allowedParams.includes(param)) {
                throw new Error(`${param}는 허용되지 않는 쿼리 파라미터입니다.`);
            }
        }
        return true;
    });
};

const checkBodyEmail = () => [
    body('email')
        .notEmpty()
        .withMessage('이메일은 필수 입력 항목입니다.')
        .isString()
        .withMessage('이메일은 문자열 형태로 입력되어야 합니다.')
        .isEmail()
        .withMessage('이메일 형식이 올바르지 않습니다')
];

const checkBodyPassword = () => [
    body('password')
        .notEmpty()
        .withMessage('비밀번호는 필수 입력 항목입니다.')
        .isString()
        .withMessage('비밀번호는 문자열 형태로 입력되어야 합니다.')
        .custom((value) => {
            const passwordOptions = {
                length: [parseInt(process.env.PASSWORD_LENGTH_MIN), parseInt(process.env.PASSWORD_LENGTH_MAX)],
                lower: parseInt(process.env.PASSWORD_LOWER),
                upper: parseInt(process.env.PASSWORD_UPPER),
                numeric: parseInt(process.env.PASSWORD_NUMERIC),
                special: parseInt(process.env.PASSWORD_SPECIAL),
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
                    `
                );
            }

            return true;
        })
];

const checkBodyArrayItems = (key) => [
    body(key)
        .isArray()
        .withMessage(`${key}는 배열이어야 합니다.`)
        .notEmpty()
        .withMessage(`${key}는 비어있지 않아야 합니다.`)
];

const checkBodyOrders = () => [
    body('delivery')
        .isObject()
        .withMessage('delivery는 객체이어야 합니다.')
        .notEmpty()
        .withMessage('delivery는 비어있지 않아야 합니다.'),

    body('delivery.address')
        .isString()
        .withMessage('address는 문자열이어야 합니다.')
        .notEmpty()
        .withMessage('address는 비어있지 않아야 합니다.'),

    body('delivery.receiver')
        .isString()
        .withMessage('receiver는 문자열이어야 합니다.')
        .notEmpty()
        .withMessage('receiver는 비어있지 않아야 합니다.'),

    body('delivery.contact')
        .isString()
        .withMessage('contact는 문자열이어야 합니다.')
        .notEmpty()
        .withMessage('contact는 비어있지 않아야 합니다.')
        .matches(/^(010)-\d{4}-\d{4}$/)
        .withMessage('contact는 010-0000-0000 형식이어야 합니다.'),

    body('totalQuantity')
        .isInt()
        .withMessage('totalQuantity는 정수여야 합니다.'),

    body('totalPrice')
        .isInt()
        .withMessage('totalPrice는 정수여야 합니다.'),

    body('bookTitle')
        .isString()
        .withMessage('bookTitle은 문자열이어야 합니다.')
        .notEmpty()
        .withMessage('bookTitle은 비어있지 않아야 합니다.')
];

const checkParamsId = () => [
    param('id')
        .toInt()
        .isInt()
        .withMessage('ID는 정수여야 합니다.')
];

const checkQueryParams = () => [
    query('limit')
        .optional()
        .isInt({ min: 1 })
        .withMessage('limit는 1 이상의 정수이어야 합니다.'),

    query('currentPage')
        .optional()
        .isInt({ min: 1 })
        .withMessage('currentPage는 1 이상의 정수이어야 합니다.'),

    query('categoryId')
        .optional()
        .isInt({ min: 0 })
        .withMessage('categoryId는 0 이상의 정수이어야 합니다.'),

        query('isNew')
        .optional()
        .isIn(['true', 'false'])
        .withMessage('isNew는 \'true\' 또는 \'false\'의 값이어야 합니다.')
];

module.exports = Object.freeze({
    validateErrorHandler,
    checkAllowedQueryParams,
    checkBodyEmail,
    checkBodyPassword,
    checkBodyArrayItems,
    checkBodyOrders,
    checkParamsId,
    checkQueryParams
});

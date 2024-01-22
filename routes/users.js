const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {join, login , passwordResetRequest, passwordReset} = require('../controller/UserController');
const {validateErrorHandler} = require('../midlewares/validation');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.post('/join',
    [
        body('email').notEmpty().isString().isEmail().withMessage('이메일 확인 필요!'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요!'),
        validateErrorHandler
    ], join);

router.post('/login',
    [
        body('email').notEmpty().isString().isEmail().withMessage('이메일 확인 필요!'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요!'),
        validateErrorHandler
    ], login);

router.post('/reset',
    [
        body('email').notEmpty().isString().isEmail().withMessage('이메일 확인 필요!'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요!'),
        validateErrorHandler
    ], passwordResetRequest);

router.put('/reset', passwordReset);

module.exports = router;

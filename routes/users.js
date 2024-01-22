const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {join, login , passwordResetRequest, passwordReset} = require('../controller/UserController');
const {validateErrorHandler, checkEmail, checkPassword} = require('../midlewares/validation');
const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.post('/join',
    [checkEmail(), checkPassword(), validateErrorHandler], join);

router.post('/login',
    [checkEmail(), checkPassword(), validateErrorHandler], login);

router.post('/reset',
    [checkEmail(), checkPassword(), validateErrorHandler], passwordResetRequest);

router.put('/reset', passwordReset);

module.exports = router;

const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {join, login , passwordResetRequest, passwordReset} = require('../controller/UserController');
const {validateErrorHandler, checkBodyEmail, checkBodyPassword} = require('../midlewares/validation');
const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.post('/join',
    [checkBodyEmail(), checkBodyPassword(), validateErrorHandler], join);

router.post('/login',
    [checkBodyEmail(), checkBodyPassword(), validateErrorHandler], login);

router.post('/reset',
    [checkBodyEmail(), checkBodyPassword(), validateErrorHandler], passwordResetRequest);

router.put('/reset', passwordReset);

module.exports = router;

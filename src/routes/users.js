const express = require('express');
const router = express.Router();
const { join, login, passwordResetRequest, passwordReset } = require('../controllers/UserController');
const { validateErrorHandler, checkBodyEmail, checkBodyPassword } = require('../midlewares/validation');
const { body, param, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.post('/join',
    [...checkBodyEmail(), ...checkBodyPassword(), validateErrorHandler], join);

router.post('/login',
    [...checkBodyEmail(), ...checkBodyPassword(), validateErrorHandler], login);

router.post('/reset',
    [...checkBodyEmail(), validateErrorHandler], passwordResetRequest);

router.put('/reset',
    [...checkBodyEmail(), ...checkBodyPassword(), validateErrorHandler], passwordReset);

module.exports = router;

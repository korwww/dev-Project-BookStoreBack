const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {addLike, removeLike} = require('../controller/LikeController');
const {validateErrorHandler} = require('../midlewares/validation');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router
    .route('/:bookId')
    .post(addLike)
    .delete(removeLike);

module.exports = router;

const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {getBooksByCategory, getSingleBook} = require('../controller/BookController');
const {validateErrorHandler} = require('../midlewares/validation');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.get('/', getBooksByCategory)

router.get('/:booksId', getSingleBook);

module.exports = router;

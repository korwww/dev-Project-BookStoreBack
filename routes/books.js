const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {getAllBooks, getSingleBook} = require('../controller/BookController');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.get('/', getAllBooks)

router.get('/:booksId', getSingleBook);

module.exports = router;

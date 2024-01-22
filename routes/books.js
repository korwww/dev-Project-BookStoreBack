const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {getAllBooks, getSingleBook} = require('../controller/BookController');
const {checkParamsId, validateErrorHandler} = require('../midlewares/validation');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.get('/', getAllBooks);

router.get('/:id', 
[checkParamsId(), validateErrorHandler], getSingleBook);

module.exports = router;

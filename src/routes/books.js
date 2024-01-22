const express = require('express');
const router = express.Router();
const { getAllBooks, getSingleBook } = require('../controller/BookController');
const { validateErrorHandler,checkAllowedQueryParams, checkParamsId, checkQueryParams } = require('../midlewares/validation');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router.get('/', 
    [...checkQueryParams(), checkAllowedQueryParams(), validateErrorHandler], 
    getAllBooks
);

router.get('/:id',
    [...checkParamsId(), validateErrorHandler],
    getSingleBook);

module.exports = router;

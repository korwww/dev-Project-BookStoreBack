const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');
const {selectAllBooks, selectCategoryBooks, selectSingleBook} = require('../controller/BookContorller');


const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

const validate = (req, res, next) => {
    const err = validationResult(req);
    if (err.isEmpty()) {
        return next();
    } else {
        return res.status(400).json(err.array());
    }
}

router.
route('/')
    .get(selectAllBooks)
    .get(selectCategoryBooks);

router.get('/:booksId', selectSingleBook);

module.exports = router;

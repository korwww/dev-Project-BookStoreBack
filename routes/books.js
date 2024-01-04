const express = require('express');
const router = express.Router();
//const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');

const jwt = require('jsonwebtoken');

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
    .get((req, res) => {
        res.status(200).json('전체 도서 조회');
    })
    .get((req, res) => {
        const categoryId = req.query.categoryId;
        const isNew = req.query.new;

        res.json('카테고리별 도서 목록 조회');
    });


router.get('/:booksId', (req, res) => {
    const bookId = req.params.booksId;
    
    res.json('개별 도서 조회');
});

module.exports = router;

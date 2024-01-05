const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
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

router
    .route('/:booksId')
    .all((req, res, next) => {
        req.booksId = req.params.booksId;
        next();
    })
    .post((req, res) => {
        res.status(200).json('좋아요 추가');
    })
    .delete((req, res) => {
        res.status(200).json('좋아요 삭제');
    });

module.exports = router;

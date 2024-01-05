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
    .route('/')
    .get((req, res) => {
        res.status(200).json('장바구니 조회');
    })
    .post((req, res) => {
        res.status(201).json('장바구니 담기');
    });

    
router.delete('/:bookId', (req, res)=>{
    const bookId = req.params.bookId;
    res.status(200).json('장바구니 조회');
});

// router.get('/:bookId', (req, res)=>{
//     res.status(200).json('장바구니에서 선택한 상품 목록 조회');
// });

module.exports = router;

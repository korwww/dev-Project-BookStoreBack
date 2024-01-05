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
        res.status(200).json('주문 목록 조회');
    })
    .post((req, res) => {
        res.status(200).json('주문 하기');
    });

router.get('/:orderId', (req, res)=>{
    const orderId = req.params.orderId;
    res.status(200).json('주문 상세 상품 조회');
});

module.exports = router;

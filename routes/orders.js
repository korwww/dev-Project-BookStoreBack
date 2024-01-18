const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');
const {getOrders, order , getOrderDetail} = require('../controller/OrderController');

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
    .get(getOrders)
    .post(order);

router.get('/:orderId', getOrderDetail);

module.exports = router;

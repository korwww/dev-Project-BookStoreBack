const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {getOrders, order , getOrderDetail} = require('../controller/OrderController');
const {validateErrorHandler} = require('../midlewares/validation');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router
    .route('/')
    .get(getOrders)
    .post(order);

router.get('/:orderId', getOrderDetail);

module.exports = router;

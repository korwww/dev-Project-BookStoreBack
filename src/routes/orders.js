const express = require('express');
const router = express.Router();
const { getOrders, order, getOrderDetail } = require('../controller/OrderController');
const { validateErrorHandler, checkParamsId, checkBodyArrayItems, checkBodyOrders} = require('../midlewares/validation');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router
    .route('/')
    .get(getOrders)
    .post(
        [...checkBodyArrayItems('items'), ...checkBodyOrders(), validateErrorHandler], 
        order
    );

router.get('/:id',
    [...checkParamsId(), validateErrorHandler], getOrderDetail);

module.exports = router;

const express = require('express');
const router = express.Router();
const { addItemsToCart, getCartItems, removeCartItems } = require('../controller/CartController');
const { validateErrorHandler, checkBodyCarts, checkBodyArrayItems, checkParamsId } = require('../midlewares/validation');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router
    .route('/')
    .get([...checkBodyArrayItems('selected'), validateErrorHandler], getCartItems)
    .post([...checkBodyCarts(), validateErrorHandler], addItemsToCart)

router.delete('/:id',
    [...checkParamsId(), validateErrorHandler],
    removeCartItems);

module.exports = router;

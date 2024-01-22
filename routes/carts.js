const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const {addItemsToCart, getCartItems, removeCartItems} = require('../controller/CartController');
const {validateErrorHandler} = require('../midlewares/validation');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router
    .route('/')
    .get(getCartItems)
    .post(addItemsToCart)

router.delete('/:cartItemId', removeCartItems);

module.exports = router;

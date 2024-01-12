const express = require('express');
const router = express.Router();
const conn = require('../mariadb');
const { body, param, validationResult } = require('express-validator');
const {addItemsToCart, getCartItems, removeCartItems} = require('../controller/CartController');

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
    .get(addItemsToCart)
    .post(getCartItems);

    
router.delete('/:bookId', (req, res)=>{
    const bookId = req.params.bookId;
    res.status(200).json('장바구니 조회');
});

router.get('/:bookId', removeCartItems);

module.exports = router;

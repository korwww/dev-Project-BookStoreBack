const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const cartController = {
    addItemsToCart : (req, res) => {
        res.status(201).json('장바구니 담기');
    },
    getCartItems : (req, res) => {
        res.status(200).json('장바구니 조회');
    },
    removeCartItems : (req, res)=>{
        res.status(200).json('장바구니에서 선택한 상품 목록 조회');
    }
}

module.exports = Object.freeze(cartController);

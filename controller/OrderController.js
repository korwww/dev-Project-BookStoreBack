const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const orderController = {
    order : (req, res) => {
        res.status(200).json('주문 하기');
    },
    getOrders : (req, res) => {
        res.status(200).json('주문 목록 조회');
    },
    getOrderDetail : (req, res)=>{
        const orderId = req.params.orderId;
        res.status(200).json('주문 상세 상품 조회');
    }
}

module.exports = Object.freeze(orderController);

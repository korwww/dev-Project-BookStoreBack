const { StatusCodes } = require('http-status-codes');
const {ensureAuthorization, handleAuthError} = require('../midlewares/auth');
const OrderService = require('../services/OrderService');

const orderController = {
    order: async (req, res) => {
        let user_id;
        try {
            const authorization = ensureAuthorization(req);
            user_id = authorization.id;
        } catch (err) {
            return handleAuthError(res, err);
        }

        try {
            const { items, delivery, firstBookTitle, totalQuantity, totalPrice } = req.body;
            const { orderId, result } = await OrderService.createOrder(user_id, items, delivery, firstBookTitle, totalQuantity, totalPrice);
            return res.status(StatusCodes.OK).json({ orderId, result });
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    getOrders: async (req, res) => {
        let user_id;
        try {
            const authorization = ensureAuthorization(req);
            user_id = authorization.id;
        } catch (err) {
            return handleAuthError(res, err);
        }

        try {
            const orders = await OrderService.getOrders(user_id);
            return res.status(StatusCodes.OK).json(orders);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    },
    getOrderDetail: async (req, res) => {
        try {
            ensureAuthorization(req);
        } catch (err) {
            return handleAuthError(res, err);
        }
        try {
            const orderDetail = await OrderService.getOrderDetail(req.params.id);
            return res.status(StatusCodes.OK).json(orderDetail);
        } catch (err) {
            console.log(err);
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
    }
}

module.exports = Object.freeze(orderController);

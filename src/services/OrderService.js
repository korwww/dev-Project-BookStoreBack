const Order = require('../models/OrderModel');

const OrderService = {
    async createOrder(userId, items, delivery, firstBookTitle, totalQuantity, totalPrice) {
        const order = new Order(userId, items, delivery, firstBookTitle, totalQuantity, totalPrice);
        const orderId = await order.save();
        const result = await order.deleteCartItems();
        return {orderId, result};
    },
    async getOrders(userId) {
        return await Order.findByUserId(userId);
    },
    async getOrderDetail(orderId) {
        return await Order.findById(orderId);
    }
}
module.exports = Object.freeze(OrderService);

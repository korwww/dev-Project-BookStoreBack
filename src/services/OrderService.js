const Order = require('../models/OrderModel');

class OrderService {
    static async createOrder(userId, items, delivery, firstBookTitle, totalQuantity, totalPrice) {
        const order = new Order(userId, items, delivery, firstBookTitle, totalQuantity, totalPrice);
        const orderId = await order.save();
        const result = await order.deleteCartItems();
        return {orderId, result};
    }

    static async getOrders(userId) {
        return await Order.findByUserId(userId);
    }

    static async getOrderDetail(orderId) {
        return await Order.findById(orderId);
    }
}

module.exports = OrderService;

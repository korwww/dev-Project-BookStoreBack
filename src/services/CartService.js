const Cart = require('../models/CartModel');

const CartService = {
    async insertItems(book_id, quantity, user_id){
        const cart = new Cart(book_id, quantity, user_id);
        const [results] = await cart.save();
        return results;
    },
    async getItems(user_id, selected){
        const [results] = await Cart.getcartItems(user_id, selected);
        return results;
    }
}

module.exports = Object.freeze(CartService);

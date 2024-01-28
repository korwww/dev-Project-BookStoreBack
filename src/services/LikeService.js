const Like = require('../models/LikeModel');

const LikeService = {
    async addLike(user_id, book_id){
        const [results] = await Like.save(user_id, book_id);
        return results;
    },
    async removeLike(user_id, book_id){
        const [results] = await Like.delete(user_id, book_id);
        return results;
    }
}

module.exports = Object.freeze(LikeService);

const Like = require('../models/LikeModel');

const LikeService = {
    async addLike(user_id, book_id){
        const [results] = await Like.save(user_id, book_id);
        return results;s
    }
}

module.exports = Object.freeze(LikeService);

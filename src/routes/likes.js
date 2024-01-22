const express = require('express');
const router = express.Router();
const { addLike, removeLike } = require('../controller/LikeController');
const { validateErrorHandler, checkParamsId } = require('../midlewares/validation');

const jwt = require('jsonwebtoken');

const dotenv = require('dotenv');
dotenv.config();

router.use(express.json());

router
    .route('/:id')
    .post([...checkParamsId(), validateErrorHandler], addLike)
    .delete([...checkParamsId(), validateErrorHandler], removeLike);

module.exports = router;

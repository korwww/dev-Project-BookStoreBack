const express = require('express');
const router = express.Router();
const {allCategory} = require('../controllers/CategoryController');

router.get('/', allCategory);

module.exports = router;

const express = require('express');
const router = express.Router();
router.use('/v1/api/access',require('./access/index.access'));
router.use('/v1/api/user', require('./users/index.users'));
router.use('/v1/api/shop',require('./shops/index.shop'));
router.use('/v1/api/product', require('./products/index.product'));
router.use('/v1/api/category', require('./categories/index.category'));
module.exports = router;
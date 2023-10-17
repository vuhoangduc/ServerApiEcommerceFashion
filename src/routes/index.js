const express = require('express');
const router = express.Router();
router.use('/v1/api/access',require('./access/index.access'));
router.use('/v1/api/user',require('./users/index.users'));
router.use('/v1/api/product',require('./products/index.product'));
module.exports = router;
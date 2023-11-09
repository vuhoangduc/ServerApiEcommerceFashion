const express = require('express');
const router = express.Router();
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const orderController = require('../../controllers/order.controller')
router.use(authentication);
router.post('/payInCart', asyneHandler(orderController.payInCart))
module.exports = router;
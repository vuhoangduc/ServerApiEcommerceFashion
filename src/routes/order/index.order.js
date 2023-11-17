const express = require('express');
const router = express.Router();
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const orderController = require('../../controllers/order.controller')
router.use(authentication);
router.post('/payInCart', asyneHandler(orderController.payInCart))
router.post('/payOneProduct', asyneHandler(orderController.payOneProduct))
router.put('/changeStatus', asyneHandler(orderController.changeStatus))
router.get('/getOrderById', asyneHandler(orderController.getOrderById))
router.get('/getOrderByIdForShop', asyneHandler(orderController.getOrderByIdForShop))
module.exports = router;
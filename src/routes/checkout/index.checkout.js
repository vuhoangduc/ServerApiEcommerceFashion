const express = require('express');
const router = express.Router();
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const checkoutController = require('../../controllers/checkout.controller');
router.post('/review', asyneHandler(checkoutController.checkoutReivew));
router.post('/oder', asyneHandler(checkoutController.orderByUser));
router.use(authentication);
router.get('/getAllOrderForShop/:q',asyneHandler(checkoutController.getOrderByIdForShop));
router.get('/getAllOrderForUser/:q',asyneHandler(checkoutController.getOrdersByUser));
router.patch('/changeStatus', asyneHandler(checkoutController.changeStatus))
router.patch('/changeStatusByUser', asyneHandler(checkoutController.changeStatusByUser))
router.patch('/cancelByShop/:id', asyneHandler(checkoutController.cancelByShop))
router.patch('/cancelByUser/:id', asyneHandler(checkoutController.cancelByUser))
module.exports = router;
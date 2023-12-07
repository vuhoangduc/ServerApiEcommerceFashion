const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
router.use(authentication);
router.get('/shop', asyneHandler(adminController.getAllShopForAdmin));
router.get('/user', asyneHandler(adminController.getAllUserForAdmin));
router.get('/product', asyneHandler(adminController.getAllProductForAdmin));
router.get('/category', asyneHandler(adminController.getAllCategoryForAdmin));
router.get('/order', asyneHandler(adminController.getAllOrderForAdmin));
router.get('/discount', asyneHandler(adminController.getAllDiscountForAdmin));
router.get('/statistical', asyneHandler(adminController.getStatistical));
router.get('/shopDetail/:Id', asyneHandler(adminController.getShopDetail));
router.post('/unpublishedProductByAdmin', asyneHandler(adminController.unpublishedProductByAdmin));
router.get('/tradingHistory/:Id', asyneHandler(adminController.getTradingHistory));
router.get('/statisticalShop/:Id', asyneHandler(adminController.getStatisticalShop));
router.put('/disable/:Id', asyneHandler(adminController.disable))
router.get('/getUser/:Id', asyneHandler(adminController.getUser))

module.exports = router;

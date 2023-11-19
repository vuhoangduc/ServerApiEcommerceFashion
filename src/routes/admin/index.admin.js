const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
router.use(authentication);
router.get('/shop',asyneHandler(adminController.getAllShopForAdmin));
router.get('/user', asyneHandler(adminController.getAllUserForAdmin));
router.get('/product', asyneHandler(adminController.getAllProductForAdmin));
router.get('/category', asyneHandler(adminController.getAllCategoryForAdmin));
router.get('/order', asyneHandler(adminController.getAllOrderForAdmin));
router.get('/discount', asyneHandler(adminController.getAllDiscountForAdmin));
module.exports = router;

const express = require('express');
const router = express.Router();
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const DiscountController = require('../../controllers/discount.controller');
const discountController = require('../../controllers/discount.controller');
// get amout a discount
router.post('/amount',asyneHandler(discountController.getDiscountAmount));
router.get('/list_product_code',asyneHandler(discountController.getAllDiscountCodesWithProducts));
router.use(authentication);
router.get('/all',asyneHandler(discountController.getAllDiscountCodeByShop));
router.post('',asyneHandler(discountController.createDiscountCode));
router.get('',asyneHandler(discountController.getAllDiscountCodesWithProducts));
module.exports = router;
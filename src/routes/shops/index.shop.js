const express = require('express');
const router = express.Router();
const shopController = require('../../controllers/shop.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const upload = require('../../util/upload_file');
router.use(authentication);
router.put('/updateShop', upload.single('avatar'), asyneHandler(shopController.updateShop));
router.post('/searchProducts', asyneHandler(shopController.searchProduct));
router.get('/getShop/:id',asyneHandler(shopController.getShop))
router.get('/getShopForShop',asyneHandler(shopController.getShopForShop))
router.get('/overview/:year',asyneHandler(shopController.orderStatistics))
router.get('/analysis/:q',asyneHandler(shopController.orderAnalysis))
module.exports = router;
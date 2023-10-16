const express = require('express');
const router = express.Router();
const shopController = require('../../controllers/shop.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const upload = require('../../util/upload_file');
router.use(authentication);
router.put('/updateShop', upload.single('avatar'), asyneHandler(shopController.updateShop));
router.post('/searchProducts', asyneHandler(shopController.searchProduct))
module.exports = router;
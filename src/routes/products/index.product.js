const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const upload = require('../../util/upload_file');
router.use(authentication);

router.post('/createProduct',asyneHandler(ProductController.createProduct));

//query
router.get('/getAllProductByShop',asyneHandler(ProductController.getAllProductByShop));

// Put
router.put('/publishById/:id',asyneHandler(ProductController.publishProductByShop))
router.put('/unpublishById/:id',asyneHandler(ProductController.unpublishProductByShop))
module.exports = router;
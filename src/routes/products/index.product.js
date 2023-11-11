const express = require('express');
const router = express.Router();
const ProductController = require('../../controllers/product.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const upload = require('../../util/upload_file');
router.use(authentication);
router.post('/createProduct',upload.array('thumbs'),asyneHandler(ProductController.createProduct));
router.post('/reviewProduct/:id',asyneHandler(ProductController.reviewProduct))
//query
router.get('/getAllProductByShop',asyneHandler(ProductController.getAllProductByShop));
router.get('/getAllProductByUser',asyneHandler(ProductController.getAllProductByUser));
router.get('/getProduct/:id',asyneHandler(ProductController.getProduct))
// Put
router.put('/publishById/:id',asyneHandler(ProductController.publishProductByShop));
router.put('/unpublishById/:id',asyneHandler(ProductController.unpublishProductByShop));
router.put('/editProduct/:id',asyneHandler(ProductController.editProduct));
module.exports = router;
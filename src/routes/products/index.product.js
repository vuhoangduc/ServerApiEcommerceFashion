const express = require("express");
const router = express.Router();
const ProductController = require("../../controllers/product.controller");
const { asyneHandler } = require("../../auth/checkAuth");
const { authentication } = require("../../auth/authUtils");
const upload = require("../../util/upload_file");
router.use(authentication);
router.post(
  "/createProduct",
  upload.array("thumbs"),
  asyneHandler(ProductController.createProduct)
);
// Ở đây
router.post(
  "/reviewProduct/:id",
  asyneHandler(ProductController.reviewProduct)
);
//query
router.get(
  "/getAllProductByShop/:q",
  asyneHandler(ProductController.getAllProductByShop)
);
router.get(
  "/getAllProductByUser",
  asyneHandler(ProductController.getAllProductByUser)
);
router.get(
  "/ofCategory/:id",
  asyneHandler(ProductController.getAllProductOfCategory)
);
router.get(
  "/ofCategoryForShop/:id/:q",
  asyneHandler(ProductController.getAllProductOfCategoryForShop)
);
router.get("/getProduct/:id", asyneHandler(ProductController.getProduct));
router.get(
  "/getAllNameProductByShop",
  asyneHandler(ProductController.getAllNameProductByShop)
);
router.get(
  "/findProduct/:p",
  asyneHandler(ProductController.findProductByName)
);
// Put
router.put(
  "/publishById/:id",
  asyneHandler(ProductController.publishProductByShop)
);
router.put(
  "/unpublishById/:id",
  asyneHandler(ProductController.unpublishProductByShop)
);
router.put(
  "/editProduct/:id",
  upload.array("thumbs"),
  asyneHandler(ProductController.editProduct)
);
module.exports = router;

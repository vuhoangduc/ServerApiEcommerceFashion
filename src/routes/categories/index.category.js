const express = require('express');
const router = express.Router();
const CategoryController = require('../../controllers/category.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const upload = require('../../util/upload_file');
router.use(authentication);

router.post('/createCategory', asyneHandler(CategoryController.createCategory));

router.get('/getAllCategory' , asyneHandler(CategoryController.getAllCategory) )

module.exports = router;
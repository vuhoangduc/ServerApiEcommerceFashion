const express = require('express');
const router = express.Router();
const adminController = require('../../controllers/admin.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
router.use(authentication);
router.get('/shop/:page',asyneHandler(adminController.getAllShopForAdmin));
router.get('/user/:page',asyneHandler(adminController.getAllUserForAdmin));
module.exports = router;

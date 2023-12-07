const express = require('express');
const router = express.Router();
const NotificationController = require('../../controllers/notification.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
router.use(authentication);
router.get('',asyneHandler(NotificationController.listNotiByUser));
router.get('/shop',asyneHandler(NotificationController.listNotiByShop));
module.exports = router;
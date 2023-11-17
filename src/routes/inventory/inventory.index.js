const express = require('express');
const router = express.Router();
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const inventoryController = require('../../controllers/inventory.controller');
router.use(authentication);
router.post('',asyneHandler(inventoryController.addStockToInventory))
module.exports = router;
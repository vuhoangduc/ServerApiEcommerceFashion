const express = require('express');
const router = express.Router();
const cartV2Controller = require('../../controllers/cartv2.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
router.use(authentication);

router.post('',asyneHandler(cartV2Controller.addToCart));
router.delete('',asyneHandler(cartV2Controller.deleteCart));
router.post('/update',asyneHandler(cartV2Controller.updateCart));
router.get('',asyneHandler(cartV2Controller.listToCart));

module.exports = router;
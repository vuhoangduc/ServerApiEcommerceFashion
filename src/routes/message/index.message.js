const express = require('express');
const router = express.Router();
const {asyneHandler} = require('../../auth/checkAuth');
const messageController = require('../../controllers/message.controller');
const { authentication } = require('../../auth/authUtils');

router.use(authentication);

router.get('/getMessages/:id',asyneHandler(messageController.getMessagers))
router.post('/sendMessage',asyneHandler(messageController.sendMessage))
router.post('/createConvarsation',asyneHandler(messageController.createConversation))
router.get('/getConvarsationsForShop',asyneHandler(messageController.getConvarsationsForShop))
// router.get('/getMessager/:id',asyneHandler(messageController.getMessager))
// router.get('/getConvarsations',asyneHandler(messageController.getConvarsations))


module.exports = router;
const express = require('express');
const router = express.Router();
const accessController = require('../../controllers/access.controller');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
router.post('/signup',asyneHandler(accessController.signUp));
router.post('/login',asyneHandler(accessController.logIn));
router.post('/verifyOtp',asyneHandler(accessController.verifyOtp));
router.use(authentication);
router.delete('/signOut',asyneHandler(accessController.signOut));

module.exports = router;
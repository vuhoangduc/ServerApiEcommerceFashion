const express = require('express');
const router = express.Router();
const userController = require('../../controllers/user.controllers');
const { asyneHandler } = require('../../auth/checkAuth');
const { authentication } = require('../../auth/authUtils');
const upload = require('../../util/upload_file');
router.post('/setUpAcc/:id', upload.single('avatar'), asyneHandler(userController.setUpAcc));
router.use(authentication);
router.put('/updateUser', upload.single('avatar'), asyneHandler(userController.updateUser));
router.put('/changePassword', asyneHandler(userController.changePassword));
router.get('/getProfile', asyneHandler(userController.getProfile));
router.post('/addAddress', asyneHandler(userController.addAddress));
router.put('/deleteAddress', asyneHandler(userController.deleteAddress));
router.put('/updateAddress', asyneHandler(userController.updateAddress));
router.get('/getAddress',asyneHandler(userController.getAddress))
module.exports = router;
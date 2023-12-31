const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.services");
class UserController {
    updateUser = async (req, res, next) => {
        if (!req.file) {
            req.file = {
                path: '1697261656746-profile.png'
            }
        }
        new SuccessResponse({
            metadata: await UserService.updateUser(req.file.path, {
                userId: req.user.userId,
                ...req.body
            })
        }).send(res);
    }

    changePassword = async (req, res, next) => {
        new SuccessResponse({
            metadata: await UserService.changePassword({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res);
    }
    setUpAcc = async (req, res, next) => {
        if (!req.file) {
            req.file = {
                path: '1697261656746-profile.png'
            }
        }
        new SuccessResponse({
            metadata: await UserService.updateUser(req.file.path, {
                userId: req.params.id,
                ...req.body
            })
        }).send(res);
    }
    getProfile = async (req, res, next) => {
        new SuccessResponse({
            metadata: await UserService.getProfile({
                userId: req.user.userId,
            })
        }).send(res);
    }
    addAddress = async (req, res, next) => {
        new SuccessResponse({
            metadata: await UserService.addAddress({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res);
    }
    deleteAddress = async (req, res, next) => {
        new SuccessResponse({
            metadata: await UserService.deleteAddress({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res);
    }
    updateAddress = async (req, res, next) => {
        new SuccessResponse({
            metadata: await UserService.updateAddress({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res);
    }
    getAddress = async (req, res, next) => {
        new SuccessResponse({
            metadata: await UserService.getAddress({
                userId: req.user.userId,
            })
        }).send(res);
    }
}
module.exports = new UserController;
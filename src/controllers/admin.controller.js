
const AdminService = require('../services/admin.services');
const { SuccessResponse } = require('../core/success.response');

class AdminController {
    getAllShopForAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getAllShopForAdmin({
            })
        }).send(res);

    }
    getAllUserForAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getAllUserForAdmin({
            })
        }).send(res);
    }
    getAllProductForAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getAllProductForAdmin({
            })
        }).send(res)
    }
    getAllCategoryForAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getAllCategoryForAdmin({
            })
        }).send(res)
    }
    getAllOrderForAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getAllOrderForAdmin({
            })
        }).send(res)
    }
    getAllDiscountForAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getAllDiscountForAdmin({
            })
        }).send(res)
    }
    getStatistical = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getStatistical({
            })
        }).send(res)
    }
    getShopDetail = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getShopDetail({
                shopId: req.params.Id
            })
        }).send(res)
    }
    unpublishedProductByAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.unpublishedProductByAdmin({
                userId: req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    getTradingHistory = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getTradingHistory({
                userId: req.user.userId,
                orderId: req.params.Id
            })
        }).send(res)
    }
    getStatisticalShop = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getStatisticalShop({
                userId: req.user.userId,
                shopId: req.params.Id
            })
        }).send(res)
    }
    disable = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.disable({
                userId: req.params.Id
            })
        }).send(res)
    }
}
module.exports = new AdminController;
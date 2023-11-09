const { SuccessResponse } = require("../core/success.response");
const orderService = require('../services/order.service')
class OrderController {
    payInCart = async (req, res, next) => {
        new SuccessResponse({
            metadata: await orderService.payInCart({
                userId:req.user.userId,
                ...req.body
            })
        }).send(res);
    }
    payOneProduct = async (req, res, next) => {
        new SuccessResponse({
            metadata: await orderService.payOneProduct({
                userId:req.user.userId,
                ...req.body
            })
        }).send(res);
    }
    changeStatus = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await orderService.changeStatus({
                ...req.body
            })
        }).send(res);
    }
    getOrderById = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await orderService.getOrderById({
                userId:req.user.userId,
            })
        }).send(res);
    }
}
module.exports = new OrderController
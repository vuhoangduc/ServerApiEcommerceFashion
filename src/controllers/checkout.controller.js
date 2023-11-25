
const { SuccessResponse } = require("../core/success.response");
const CheckoutService = require('../services/checkout.services');
class CheckoutController{

    checkoutReivew = async (req,res,next) =>{
        new SuccessResponse({
            message:'Create new Cart success',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
    orderByUser = async (req,res,next) =>{
        new SuccessResponse({
            message:'Create new Cart success',
            metadata: await CheckoutService.orderByUser(req.body)
        }).send(res)
    }
    getOrdersByUser = async (req,res,next) =>{
        new SuccessResponse({
            message:'Lấy order thành công',
            metadata: await CheckoutService.getOrdersByUser({
                userId:req.user.userId,
                query:req.params.q
            })
        }).send(res)
    }
    getOrderByIdForShop = async (req,res,next) =>{
        new SuccessResponse({
            message:'Lấy order thành công',
            metadata: await CheckoutService.getOrderByIdForShop({
                shopId:req.user.userId,
                query:req.params.q
            })
        }).send(res)
    }
    changeStatus = async (req,res,next) =>{
        new SuccessResponse({
            message:'Thay đổi status thành công',
            metadata: await CheckoutService.updateOrderStatusByShop({
                shopId:req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    changeStatusByUser = async (req,res,next) =>{
        new SuccessResponse({
            message:'Thay đổi status thành công',
            metadata: await CheckoutService.updateOrderStatusByUser({
                userId:req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    cancelByShop = async (req,res,next) =>{
        new SuccessResponse({
            message:'Hủy đơn hàng thành công',
            metadata: await CheckoutService.cancelOrderByShop({
                orderId:req.params.id,
                shopId:req.user.userId,
            })
        }).send(res)
    }
    cancelByUser = async (req,res,next) =>{
        new SuccessResponse({
            message:'Hủy đơn hàng thành công',
            metadata: await CheckoutService.cancelOrderByUser({
                orderId:req.params.id,
                userId:req.user.userId,
            })
        }).send(res)
    }
}
module.exports = new CheckoutController;
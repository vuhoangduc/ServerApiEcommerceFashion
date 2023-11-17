
const { SuccessResponse } = require("../core/success.response");
const CartV2Service = require('../services/cart_v2.services');
class CartV2Controller{
    addToCart = async (req,res,next)=>{
        new SuccessResponse({
            message:'Create new Cart',
            metadata:await CartV2Service.addToCart(req.body)
        }).send(res)
    }
    updateCart = async (req,res,next) =>{
        new SuccessResponse({
            message:'Update Cart',
            metadata:await CartV2Service.updateCart(req.body)
        }).send(res)
    }
    deleteCart = async (req,res,next) =>{
        new SuccessResponse({
            message:'Update Cart',
            metadata:await CartV2Service.deleteUserCart(req.body)
        }).send(res)
    }
    listToCart = async (req,res,next) =>{
        new SuccessResponse({
            message:'Update Cart',
            metadata:await CartV2Service.getListUserCart(req.body)
        }).send(res)
    }

}
module.exports = new CartV2Controller;
const { SuccessResponse } = require("../core/success.response");
const CartService = require('../services/cart.services');
class CartController{
    createCart = async(req,res,next)=>{
        new SuccessResponse({
            metadata: await CartService.createCart({
                userId:req.user.userId
            })
        })
        .send(res);
    }
    addToCart = async(req,res,next)=>{
        new SuccessResponse({
            metadata: await CartService.addToCart({
                userId:req.user.userId,
                ...req.body
            })
        }).send(res);
    }
    getCart = async(req,res,next)=>{
        new SuccessResponse({
            metadata: await CartService.getCart({
                userId:req.user.userId,
            })
        }).send(res);
    }
}
module.exports = new CartController;
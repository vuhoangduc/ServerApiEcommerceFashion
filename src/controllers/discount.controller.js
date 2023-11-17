
const DiscountService = require('../services/discount.services');
const {SuccessResponse} = require('../core/success.response');
const { model } = require('mongoose');

class DiscountController{
    createDiscountCode = async (req,res,next)=>{
        new SuccessResponse({
            message :'Successful Code Generations',
            metadata: await DiscountService.createDiscountCode({
                ...req.body,
                shopId:req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodes = async (req,res,next)=>{
        new SuccessResponse({
            message :'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodeByShop({
                ...req.query,
                shopId:req.user.userId
            })
        }).send(res)
    }

    getAllDiscountCodesWithProducts = async (req,res,next)=>{
        new SuccessResponse({
            message :'Successful Code Found',
            metadata: await DiscountService.getAllDiscountCodeWithProduct({
                ...req.query,
            })
        }).send(res)
    }

    getDiscountAmount = async (req,res,next)=>{
        new SuccessResponse({
            message :'Successful Code Found',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }


}

module.exports = new DiscountController()
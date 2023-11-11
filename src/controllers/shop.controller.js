const { SuccessResponse } = require("../core/success.response");
const ShopService = require("../services/shop.serviece");
const storeDetailsSchema = require('../models/storeDetails.model')
class ShopController{
    updateShop = async (req, res, next) => {
        const {phoneNumberShop,emailShop,nameShop} = req.body
        const checkShopAliable = await storeDetailsSchema.findOne({$or: [{phoneNumberShop}, {emailShop}, {nameShop}]})
            if (checkShopAliable) {
                return res.send({message: 'Shop already exists', status: 404})
            }
        if(!req.file){
            req.file={
                path: 'avata-shop.jpg'
            }
        }
        new SuccessResponse({
            metadata: await ShopService.updateShop(req.file.path,{
                shopId:req.user.userId,
                ...req.body
            })
        }).send(res);
    }
    searchProduct = async (req, res, next) => {
        new SuccessResponse({
            metadata: await ShopService.searchProduct({
                shopId: req.user.userId,
                nameSearch: req.body.nameSearch
            })
        }).send(res);
    }
    getShop = async (req, res, next) =>{
        new SuccessResponse({
            metadata: await ShopService.getShop({
                shopId: req.params.id
            })
        }).send(res);
    }
}

module.exports = new ShopController;
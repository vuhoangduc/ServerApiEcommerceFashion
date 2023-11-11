const { SuccessResponse } = require("../core/success.response");
const ShopService = require("../services/shop.serviece");

class ShopController{

    updateShop = async(req,res,next)=>{
        console.log(req.body);
        if(!req.file){
            req.file={
                path: 'Screenshot 2023-10-22 005451.png'
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
    getShopForShop = async(req,res,next)=>{
        new SuccessResponse({
            metadata: await ShopService.getShopForShop({
                shopId: req.user.userId
            })
        }).send(res);
    }
}

module.exports = new ShopController;
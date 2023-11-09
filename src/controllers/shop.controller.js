const { SuccessResponse } = require("../core/success.response");
const ShopService = require("../services/shop.serviece");

class ShopController{

    updateShop = async(req,res,next)=>{
        if(req.file){
            req.file={
                path: Date.now() + req.file.originalname
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
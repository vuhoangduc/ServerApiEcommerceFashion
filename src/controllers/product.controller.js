const ProductService = require('../services/product.service');
const { SuccessResponse } = require("../core/success.response");
class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            metadata: await ProductService.createProduct(null,
                {
                    product_shop:req.user.userId,
                    ...req.body
                })
        }).send(res);
    }

    // Put
    publishProductByShop = async (req,res,next) =>{
        new SuccessResponse({
            message: 'Product publish success!',
            metadata: await ProductService.publishProductByShop({
                product_shop:req.user.userId,
                product_Id:req.params.id
            })
        })
        .send(res)
    }
    unpublishProductByShop = async (req,res,next) =>{
        new SuccessResponse({
            message: 'Product unpublish success!',
            metadata: await ProductService.unpublishProductByShop({
                product_shop: req.user.userId,
                product_Id:req.params.id
            })
        })
        .send(res)
    }
    // Query
    getAllProductByShop = async (req,res,next) =>{
        new SuccessResponse({
            message: 'Lấy tất cả sản phẩm thành công',
            metadata: await ProductService.getAllProductByShop({
                product_shop: req.user.userId,
            })
        })
        .send(res)
    }
}
module.exports = new ProductController;
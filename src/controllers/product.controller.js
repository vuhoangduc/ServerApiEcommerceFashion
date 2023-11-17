const ProductService = require('../services/product.service');
const { SuccessResponse } = require("../core/success.response");
class ProductController {
    createProduct = async (req, res, next) => {
        if(!req.files){
            req.files = [
                '',
                '',
                ''
            ]
        }
        new SuccessResponse({
            metadata: await ProductService.createProduct(req.files,
                {
                    product_shop:req.user.userId,
                    ...req.body
                })
        }).send(res);
    }
    reviewProduct = async (req,res,next) =>{
        new SuccessResponse({
            metadata: await ProductService.reviewProduct({
                user_id:req.user.userId,
                product_id:req.params.id,
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
    editProduct = async (req,res,next) =>{
        new SuccessResponse({
            message:'Chỉnh sửa product thành công',
            metadata: await ProductService.editProduct(req.files,{
                product_id:req.params.id,
                ...req.body
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
                query:req.params.q
            })
        })
        .send(res)
    }
    getAllNameProductByShop = async (req,res,next) =>{
        new SuccessResponse({
            message:'Lấy tất cả tên sản phẩm của shop thành công',
            metadata: await ProductService.getAllNameProductByShop({
                product_shop:req.user.userId
            })
        }).send(res)
    }
    findProductByName = async (req,res,next) =>{
        new SuccessResponse({
            message:'Lấy tất cả tên sản phẩm của shop thành công',
            metadata: await ProductService.findProductByName({
                product_shop:req.user.userId,
                product_name:req.params.p
            })
        }).send(res)
    }
    getAllProductByUser = async (req, res, next) => {
        new SuccessResponse({
            message: 'Lấy tất cả sản phẩm thành công',
            metadata: await ProductService.getAllProductByUser({
            })
        })
        .send(res)
    }
    getProduct = async (req,res,next) =>{
        new SuccessResponse({
            message:'Lấy thông tin sản phẩm thành công',
            metadata: await ProductService.getProduct({
                product_id:req.params.id,
            })
        }).send(res)
    }
}
module.exports = new ProductController;
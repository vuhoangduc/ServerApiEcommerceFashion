const CategoryService = require('../services/category.services');
const { SuccessResponse } = require("../core/success.response");

class ProductController {
    createCategory = async (req, res, next) => {
        new SuccessResponse({
            metadata: await CategoryService.createCategory(req.file.path,
                {
                    ...req.body
                })
        }).send(res);
    }
    updateCategory = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await CategoryService.updateCategory(req.file.path,
                {
                    ...req.body
                })
        }).send(res);
    }
    deleteCategory = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await CategoryService.deleteCategory({
                id_category: req.body.id_category
            })
        }).send(res);
    }
    getAllCategory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Lấy tất cả loại sản phẩm thành công',
            metadata: await CategoryService.getAllCategory({})
        }).send(res);
    }
}
module.exports = new ProductController;
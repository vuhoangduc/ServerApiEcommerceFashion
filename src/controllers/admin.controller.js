
const AdminService = require('../services/admin.services');
const {SuccessResponse} = require('../core/success.response');

class AdminController{
    getAllShopForAdmin = async(req,res,next)=>{
        new SuccessResponse({
            metadata: await AdminService.getAllShopForAdmin({
                page:req.params.page
            })
        }).send(res);
        
    }
    getAllUserForAdmin = async(req,res,next) =>{
        new SuccessResponse({
            metadata: await AdminService.getAllUserForAdmin({
                page:req.params.page
            })
        }).send(res);
    }
    getAllProductForAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getAllProductForAdmin({
                page:req.params.page
            })
        }).send(res)
    }
    getAllCategoryForAdmin = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await AdminService.getAllCategoryForAdmin({
                page:req.params.page
            })
        }).send(res)
    }
    getAllOrderForAdmin = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await AdminService.getAllOrderForAdmin({
                page:req.params.page
            })
        }).send(res)
    }
    getAllDiscountForAdmin = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await AdminService.getAllDiscountForAdmin({
                page:req.params.page
            })
        }).send(res)
    }
}
module.exports = new AdminController;
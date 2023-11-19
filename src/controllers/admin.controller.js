
const AdminService = require('../services/admin.services');
const {SuccessResponse} = require('../core/success.response');

class AdminController{
    getAllShopForAdmin = async(req,res,next)=>{
        new SuccessResponse({
            metadata: await AdminService.getAllShopForAdmin({
            })
        }).send(res);
        
    }
    getAllUserForAdmin = async(req,res,next) =>{
        new SuccessResponse({
            metadata: await AdminService.getAllUserForAdmin({
            })
        }).send(res);
    }
    getAllProductForAdmin = async (req, res, next) => {
        new SuccessResponse({
            metadata: await AdminService.getAllProductForAdmin({
            })
        }).send(res)
    }
    getAllCategoryForAdmin = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await AdminService.getAllCategoryForAdmin({
            })
        }).send(res)
    }
    getAllOrderForAdmin = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await AdminService.getAllOrderForAdmin({
            })
        }).send(res)
    }
    getAllDiscountForAdmin = async (req, res, next) => { 
        new SuccessResponse({
            metadata: await AdminService.getAllDiscountForAdmin({
            })
        }).send(res)
    }
}
module.exports = new AdminController;
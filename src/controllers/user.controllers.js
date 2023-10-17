const { SuccessResponse } = require("../core/success.response");
const UserService = require("../services/user.services");
class UserController{
    updateUser = async(req,res,next)=>{
        if(!req.file){
            req.file={
                path:'1697261656746-profile.png'
            }
        }
        new SuccessResponse({
            metadata: await UserService.updateUser(req.file.path,{
                userId:req.user.userId,
                ...req.body
            })
        }).send(res);
    }
}
module.exports = new UserController;
const { updateUser} = require('./userSchema.services')
const informationUserSchema = require('../models/information.model');
class UserService {

    static updateUser= async(avatar,{userId,phoneNumber,address,fullName,gender,userName})=>{
        const info = await informationUserSchema.create({
            phoneNumber,
            address,
            avatar,
            fullName,
            gender
        })
        if(!info) return {message:'có lỗi khi update user!'};
        const user = await updateUser(info._id,userName,userId);
        if (!user) return {message:'có lỗi khi update user!!'};
        return{
            message:"cập nhật thành công!!",
            user:user
        }
    }
}
module.exports = UserService;
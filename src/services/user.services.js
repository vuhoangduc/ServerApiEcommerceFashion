const { updateUser, changePassword } = require('./userSchema.services')
const informationUserSchema = require('../models/information.model');
const userSchema = require('../models/user.model')
const bcrypt = require('bcrypt');
class UserService {

    static updateUser = async (avatar, { userId, phoneNumber, address, fullName, gender, userName }) => {
        const info = await informationUserSchema.create({
            phoneNumber,
            address,
            avatar,
            fullName,
            gender
        })
        if (!info) return { message: 'có lỗi khi update user!' };
        const user = await updateUser(info._id, userName, userId);
        if (!user) return { message: 'có lỗi khi update user!!' };
        return {
            message: "cập nhật thành công!!",
            user: user
        }
    }
    static changePassword = async ({ userId, oldPassword, newPassword }) => {
        const checkUser = await userSchema.findOne({ _id: userId })
        if (!checkUser) return { message: 'Người dùng không tồn tại!' }
        const checkOldPassword = await bcrypt.compare(oldPassword, checkUser.password)
        if (!checkOldPassword) return { message: 'Mật khẩu cũ chưa chính xác!' }
        const hashPassword = await bcrypt.hash(newPassword, 10)
        const user = await changePassword(userId, hashPassword);
        if (!user) return { message: 'Có lỗi khi đổi mật khẩu!' }
        return {
            message: 'Đổi mật khẩu thành công',
            user
        }
    }
    static getProfile = async ({ userId }) => {
        const checkUser = await userSchema.findOne({ _id: userId }).populate('information')
        if (!checkUser) return { message: 'Người dùng không tồn tại!' }
        return {
            checkUser
        }
    }
}
module.exports = UserService;
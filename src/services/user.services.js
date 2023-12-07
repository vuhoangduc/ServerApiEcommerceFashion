const { updateUser, changePassword } = require('./userSchema.services')
const informationUserSchema = require('../models/information.model');
const userSchema = require('../models/user.model')
const bcrypt = require('bcrypt');
const { default: mongoose } = require('mongoose');
const addressSchema = require('../models/address.model')
class UserService {

    static updateUser = async (avatar, { userId, phoneNumber, fullName, gender, userName }) => {
        const checkInfoUser = await userSchema.findOne({ _id: userId });
        let user = [];
        if (!checkInfoUser.information) {
            const info = await informationUserSchema.create({
                phoneNumber,
                avatar,
                fullName,
                gender
            })
            if (!info) return { message: 'có lỗi khi update user!' };
            user = await updateUser(info._id, userName, userId);
            if (!user) return { message: 'có lỗi khi update user!!' };
        } else {
            user = await informationUserSchema.findOneAndUpdate(
                {
                    _id: checkInfoUser.information
                },
                {
                    $set: {
                        phoneNumber,
                        avatar,
                        fullName,
                        gender
                    }
                }
            )
            if (!user) return { message: 'có lỗi khi update user!!' };
        }
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
        const checkUser = await userSchema.findOne({ _id: userId })
            .populate({
                path: 'information',
                populate: {
                    path: 'address', // Use 'address' instead of 'addresses'
                    options: { strictPopulate: false }
                }
            })
            .select('-password')
            .exec();
        if (!checkUser) return { message: 'Người dùng không tồn tại!' }
        return {
            checkUser
        }
    }
    static addAddress = async ({ userId, nameAddress, address }) => {
        const checkUser = await userSchema.findOne({ _id: userId }).populate('information')
        if (!checkUser.information) {
            return 'Hãy cập nhật thông tin người dùng'
        }
        const newAddress = await addressSchema.create({
            nameAddress,
            customAddress: address
        })
        const user = await informationUserSchema.findOneAndUpdate({ _id: checkUser.information }, {
            $push: {
                address: newAddress._id
            }
        }, { new: true }).populate('address')
        return {
            user
        }
    }
    static deleteAddress = async ({ userId, addressId }) => {
        const user = await userSchema.findOne({ _id: userId }).populate('information')
        if (!user.information) {
            return 'Hãy cập nhật thông tin người dùng'
        }
        await addressSchema.findOneAndDelete({ _id: addressId })
        const deleteAddressUser = await informationUserSchema.findOneAndUpdate({
            _id: user.information._id
        },
            {
                $pull: {
                    address: addressId
                }
            },
            { new: true }).populate('address').lean();
        return {
            deleteAddressUser
        }
    }
    static updateAddress = async ({ userId, addressId, nameAddress, address }) => {
        const user = await userSchema.findOne({ _id: userId }).populate('information')
        if (!user.information) {
            return 'Hãy cập nhật thông tin người dùng'
        }
        const updateAddress = await addressSchema.findOneAndUpdate({ _id: addressId }, {
            $set: {
                nameAddress,
                customAddress: address
            }
        }, { new: true })
        return {
            updateAddress
        }
    }
}
module.exports = UserService;
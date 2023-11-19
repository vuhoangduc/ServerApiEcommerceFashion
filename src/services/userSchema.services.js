const userSchema = require("../models/user.model")
const informationUserSchema = require('../models/information.model');
const storeDetailSchema = require('../models/storeDetails.model');

const findByEmail = async (email) => {
  return await userSchema.findOne({ email }).populate('information').select().lean()
}
const findById = async (userId) => {
  console.log(userId);
  return await userSchema.findById({ _id: userId }).select('-password').populate('information').lean();
}
const findByIdForShop = async (shopId) => {
  console.log(shopId);
  return await storeDetailSchema.findById({ _id: shopId }).lean();
}
const createUser = async(email,password,role) =>{
  return await userSchema.create({
    email,
    password,
    user_name:'',
    role,
    information:null
  })
}
const changePassword = async (userId, password) => {
  return await userSchema.findByIdAndUpdate(
    { _id: userId },
    { $set: { password } },
    { new: true })
}
const updateUser = async (infoId, user_name, userId) => {
  try {
    const updatedUser = await userSchema.findByIdAndUpdate(
      userId,
      { $set: { user_name: user_name, information: infoId } },
      { new: true }
    ).populate('information');

    return updatedUser;
  } catch (error) {
    throw error;
  }
}
const updateStatus = async (userId) => {
  try {
    // Đầu tiên, lấy thông tin người dùng hiện tại
  const user = await userSchema.findById(userId);
  if (!user) {
      // Người dùng không tồn tại
      throw new Error("User not found");
  }
    // Kiểm tra trạng thái hiện tại và thay đổi
  const newStatus = user.status === "active" ? "inactive" : "active";
    // Cập nhật trạng thái mới
  const updatedUser = await userSchema.findByIdAndUpdate(
      { _id: userId },
      { $set: { status: newStatus } },
      { new: true }
  );
  return updatedUser;
  } catch (error) {
  console.error("Error updating status:", error);
  throw error;
  }
};
module.exports = {
  findByEmail,
  findById,
  changePassword,
  createUser,
  updateUser,
  updateStatus,
  findByIdForShop
}
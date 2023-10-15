const userSchema = require("../models/user.model")
const informationUserSchema = require('../models/information.model');
const findByEmail = async (email) => {
  return await userSchema.findOne({ email }).populate('information').select().lean()
}
const findById = async (userId) => {
  return await userSchema.findById({ _id: userId }).select().populate('information').lean();
}
const createUser = async(email,password) =>{
  console.log(email,password);
  return await userSchema.create({
    email,
    password,
    user_name:'',
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


module.exports = {
  findByEmail,
  findById,
  changePassword,
  createUser,
  updateUser
}
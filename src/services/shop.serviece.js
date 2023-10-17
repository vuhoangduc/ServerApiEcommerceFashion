const storeDetailsSchema = require('../models/storeDetails.model');
const userSchema = require('../models/user.model');
class ShopService {

    static updateShop = async (avatarShop, { shopId, nameShop, phoneNumberShop, des, emailShop, address }) => {
        const storeDetails = await storeDetailsSchema.create({
            nameShop,
            phoneNumberShop,
            avatar: avatarShop,
            des,
            emailShop,
            address
        })
        if(!storeDetails) return {message:'có lỗi khi update shop!'};
        const shop = await userSchema.findOneAndUpdate({ _id: shopId }, {
            $set: { information: storeDetails._id }
        });
        if(!shop) return {message:'có lỗi khi update shop!'};
        return{
            message: "cập nhật thành công!!",
            shop: shop
        }
    }
    static searchProduct = async (shopId, nameSearch) => {
        const query = { name: new RegExp(nameSearch, 'i') };
        const product = storeDetailsSchema.find(shopId, {query })
        if(!product) return {message:'có lỗi khi tìm kiếm sản phẩm trong shop!'};
        return {
            message:"Tìm kiếm thành công!!",
            product
        }
    }

}
module.exports = ShopService;
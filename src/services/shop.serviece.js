const storeDetailsSchema = require('../models/storeDetails.model');
const userSchema = require('../models/user.model');
const productSchema = require('../models/product.model');
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
    static searchProduct = async ({shopId, nameSearch}) => {
        try {
        const query = {
            product_shop: shopId,
            product_name: new RegExp(nameSearch, 'i')
        };
        const products = await productSchema.find(query);

        if (!products || products.length === 0) {
            return { message: 'Không tìm thấy sản phẩm nào trong cửa hàng!' };
        }

        return {
            message: "Tìm kiếm thành công!!",
            products
        };
    } catch (error) {
        console.error("Lỗi khi tìm kiếm sản phẩm:", error);
        return { message: 'Có lỗi khi tìm kiếm sản phẩm trong cửa hàng!' };
    }
    }

}
module.exports = ShopService;
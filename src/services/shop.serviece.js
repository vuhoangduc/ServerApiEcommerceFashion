const storeDetailsSchema = require('../models/storeDetails.model');
const userSchema = require('../models/user.model');
const productSchema = require('../models/product.model');
class ShopService {
    static updateShop = async (avatarShop, { shopId, nameShop, phoneNumberShop, des, emailShop, address }) => {
        try {
            const findStoreDetail = await storeDetailsSchema.findOne({ _id: shopId })
        let storeDetails = [];
        if (!findStoreDetail) {
            const checkShopAliable = await storeDetailsSchema.findOne({$or: [{phoneNumberShop}, {emailShop}, {nameShop}]})
            if (checkShopAliable) return ({message: 'Shop already exists', status: 404})
            storeDetails = await storeDetailsSchema.create({
                _id: shopId,
            const storeDetails = await storeDetailsSchema.create({
                _id:shopId,
                nameShop,
                phoneNumberShop,
                avatarShop: avatarShop,
                des,
                emailShop,
                address
            })
        } else {
            storeDetails = await storeDetailsSchema.findByIdAndUpdate({ _id: shopId }, {
                $set: {
                    nameShop,
                    phoneNumberShop,
                    avatarShop: avatarShop,
                    des,
                    emailShop,
                    address
                }
                
            },{new: true})
        }
        if (!storeDetails) return { message: 'có lỗi khi update shop!' };
        return{
            message: "cập nhật thành công!!",
            shop: storeDetails
        }
        } catch (error) {
            return {
                message: 'có lỗi khi update shop!'
            }
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

    static getShop = async ({shopId}) =>{
        const resShop = {};
        const shop = await storeDetailsSchema.findById(shopId)
        .select('-createdAt -updatedAt');
        const productOfShop = await productSchema.find({product_shop:shop._id,isPublished: true})
        .select('-product_description -product_attributes -createdAt -updatedAt -product_slug');
        resShop.shop=shop;
        resShop.products=productOfShop;
        return resShop;
    }
    static getShopForShop = async ({shopId}) =>{
        const shop = await storeDetailsSchema.findById(shopId)
        .select('-createdAt -updatedAt');
        return shop;
    }
    
}
module.exports = ShopService;
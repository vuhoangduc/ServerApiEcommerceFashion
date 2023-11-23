const storeDetailsSchema = require('../models/storeDetails.model');
const userSchema = require('../models/user.model');
const productSchema = require('../models/product.model');
const categorySchema = require('../models/category.model');
const orderSchema = require('../models/orderV2.model');
const discountSchema = require('../models/discount.model');
class AdminService {
    static getAllShopForAdmin = async () => {
        // Tính toán giá trị skip dựa trên trang và kích thước trang
        // Thực hiện truy vấn với limit và skip
        const foundShop = await storeDetailsSchema
            .find({})

        if (foundShop.length === 0) {
            return { message: 'Chưa có shop nào' };
        }
        return foundShop;
    }

    static getAllUserForAdmin = async () => {
        // Tính toán giá trị skip dựa trên trang và kích thước trang
        // Thực hiện truy vấn với limit và skip
        const foundUser = await userSchema
            .find({})
            .select('-password')
            .populate('information');

        if (foundUser.length === 0) {
            return { message: 'Chưa có shop nào' };
        }
        return foundUser;
    }
    static getAllProductForAdmin = async () => {
        const foundProduct = await productSchema
            .find()
            .populate('product_shop')
            .populate('category')
        if (foundProduct.length === 0) {
            return { message: 'Chưa có Sản phẩm nào' };
        }
        return foundProduct;
    }
    static getAllCategoryForAdmin = async () => {
        const foundCategory = await categorySchema
            .find()
        if (foundCategory.length === 0) {
            return { message: 'Chưa có loại sản phẩm nào' };
        }
        return foundCategory;
    }
    static getAllOrderForAdmin = async () => {
        const foundOrder = await orderSchema
            .find()
            .populate({
                path: 'order_userId',
            })
        if (foundOrder.length === 0) {
            return { message: 'Chưa có đơn hàng nào' };
        }
        return foundOrder;
    }
    static getAllDiscountForAdmin = async () => {
        const foundDiscount = await discountSchema
            .find()
            .populate({
                path: 'discount_shopId',
            })
        if (foundDiscount.length === 0) {
            return { message: 'Chưa có mã giảm giá nào' };
        }
        return foundDiscount;
    }
}


module.exports = AdminService;
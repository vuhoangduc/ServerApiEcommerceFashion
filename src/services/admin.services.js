const storeDetailsSchema = require('../models/storeDetails.model');
const userSchema = require('../models/user.model');
const productSchema = require('../models/product.model');
const categorySchema = require('../models/category.model');
const orderSchema = require('../models/orderV2.model');
const discountSchema = require('../models/discount.model');
class AdminService {
    static getAllShopForAdmin = async ({ page, pageSize = 5 }) => {
        // Tính toán giá trị skip dựa trên trang và kích thước trang
        const skip = (page - 1) * pageSize;
        // Thực hiện truy vấn với limit và skip
        const foundShop = await storeDetailsSchema
            .find({})
            .skip(skip)
            .limit(pageSize);

        if (foundShop.length === 0) {
            return { message: 'Chưa có shop nào' };
        }
        return foundShop;
    }

    static getAllUserForAdmin = async ({ page, pageSize = 5 }) => {
        // Tính toán giá trị skip dựa trên trang và kích thước trang
        const skip = (page - 1) * pageSize;
        // Thực hiện truy vấn với limit và skip
        const foundUser = await userSchema
            .find({})
            .skip(skip)
            .limit(pageSize)
            .select('-password')
            .populate('information');

        if (foundUser.length === 0) {
            return { message: 'Chưa có shop nào' };
        }
        return foundUser;
    }
    static getAllProductForAdmin = async ({ page, pageSize = 5 }) => {
        const skip = (page - 1) * pageSize;
        const foundProduct = await productSchema
            .find()
            .populate('product_shop')
            .populate('category')
            .skip(skip)
            .limit(pageSize)
        if (foundProduct.length === 0) {
            return { message: 'Chưa có Sản phẩm nào' };
        }
        return foundProduct;
    }
    static getAllCategoryForAdmin = async ({ page, pageSize = 5 }) => {
        const skip = (page - 1) * pageSize;
        const foundCategory = await categorySchema
            .find()
            .skip(skip)
            .limit(pageSize)
        if (foundCategory.length === 0) {
            return { message: 'Chưa có loại sản phẩm nào' };
        }
        return foundCategory;
    }
    static getAllOrderForAdmin = async ({ page, pageSize = 5 }) => {
        const skip = (page - 1) * pageSize;
        const foundOrder = await orderSchema
            .find()
            .skip(skip)
            .populate({
                path: 'order_userId',
                select: '-password'
            })
            .limit(pageSize)
        if (foundOrder.length === 0) {
            return { message: 'Chưa có đơn hàng nào' };
        }
        return foundOrder;
    }
    static getAllDiscountForAdmin = async ({ page, pageSize = 5 }) => {
        const skip = (page - 1) * pageSize;
        const foundDiscount = await discountSchema
            .find()
            .populate({
                path: 'discount_shopId',
                select: '-password'
            })
            .skip(skip)
            .limit(pageSize)
        if (foundDiscount.length === 0) {
            return { message: 'Chưa có mã giảm giá nào' };
        }
        return foundDiscount;
    }
}


module.exports = AdminService;
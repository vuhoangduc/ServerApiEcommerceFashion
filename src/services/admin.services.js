const storeDetailsSchema = require('../models/storeDetails.model');
const userSchema = require('../models/user.model');
const productSchema = require('../models/product.model');

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
}


module.exports = AdminService;
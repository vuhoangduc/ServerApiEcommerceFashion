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
                select: '-password'
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
                select: '-password'
            })
        if (foundDiscount.length === 0) {
            return { message: 'Chưa có mã giảm giá nào' };
        }
        return foundDiscount;
    }
    static getStatistical = async () => {
        const productByYear = await productSchema.aggregate([
            {
                $group: {
                    _id: { $year: { $toDate: "$createdAt" } }, // Trích xuất năm từ trường createdAt
                    productCount: { $sum: 1 },
                }
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        const countProducts = await productSchema.find().count()
        const userByYear = await userSchema.aggregate([
            {
                $match: {
                    role: 'User',
                }
            },
            {
                $group: {
                    _id: { $year: { $toDate: "$createdAt" } }, // Trích xuất năm từ trường createdAt
                    userCount: { $sum: 1 },
                }
            },
            {
                $sort: {
                    _id: 1,
                },
            }
        ])
        const countUsers = await userSchema.find({ role: 'User' }).count()
        const shopByYear = await userSchema.aggregate([
            {
                $match: {
                    role: 'Shop',
                }
            },
            {
                $group: {
                    _id: { $year: { $toDate: "$createdAt" } }, // Trích xuất năm từ trường createdAt
                    shopCount: { $sum: 1 },
                }
            },
            {
                $sort: {
                    _id: 1,
                },
            }
        ])
        const countShops = await userSchema.find({ role: 'Shop' }).count()
        const orderByYear = await orderSchema.aggregate([
            {
                $group: {
                    _id: { $year: { $toDate: "$createdAt" } }, // Trích xuất năm từ trường createdAt
                    ordertCount: { $sum: 1 },
                }
            },
            {
                $sort: {
                    _id: 1,
                },
            },
        ]);
        const countOrders = await orderSchema.find().count()
        const topProductSold = await orderSchema.aggregate([
            { $unwind: "$order_products" },
            { $unwind: "$order_products.item_products" },
            {
                $group: {
                    _id: "$order_products.item_products.productId",
                    totalSoldQuantity: { $sum: "$order_products.item_products.quantity" },
                },
            },
            { $sort: { totalSoldQuantity: -1 } }, { $limit: 5 },
            {
                $project: {
                    _id: { $toObjectId: "$_id" },
                    totalSoldQuantity: 1,
                },
            },
            {
                $lookup: {
                    from: "products",  
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo",
                },
            },
        ])
        const countCategory = await categorySchema.findOne().count();
        const mergedData = {};

// Gộp dữ liệu theo năm từ các truy vấn
[productByYear, userByYear, shopByYear, orderByYear].forEach(data => {
    data.forEach(item => {

        // Nếu năm chưa tồn tại trong đối tượng gộp, tạo mới
        if (!mergedData[item._id]) {
            mergedData[item._id] = {};
        }

        // Gộp thông tin từ mảng hiện tại vào đối tượng gộp
        Object.assign(mergedData[item._id], item);
    });
});

        return {
            countUsers,countShops,countProducts,countOrders,countCategory,
            mergedData,topProductSold
        };
    }
}


module.exports = AdminService;

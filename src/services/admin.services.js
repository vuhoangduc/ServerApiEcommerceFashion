const storeDetailsSchema = require("../models/storeDetails.model");
const userSchema = require("../models/user.model");
const productSchema = require("../models/product.model");
const categorySchema = require("../models/category.model");
const orderSchema = require("../models/orderV2.model");
const discountSchema = require("../models/discount.model");
const notificationSchema = require("../models/notification.model");
const mongoose = require("mongoose");
const keyTokenSchema = require("../models/keytoken.model");

class AdminService {
  static getAllShopForAdmin = async () => {
    // Tính toán giá trị skip dựa trên trang và kích thước trang
    // Thực hiện truy vấn với limit và skip
    const foundShop = await storeDetailsSchema.find({}).select("-password");
    if (foundShop.length === 0) {
      return { message: "Chưa có shop nào" };
    }
    return foundShop;
  };

  static getAllUserForAdmin = async () => {
    // Tính toán giá trị skip dựa trên trang và kích thước trang
    // Thực hiện truy vấn với limit và skip
    const foundUser = await userSchema
      .find({ role: "User" })
      .select("-password")
      .populate({
        path: "information",
        populate: {
          path: "address",
          options: { strictPopulate: false },
        },
      });

    if (foundUser.length === 0) {
      return { message: "Chưa có shop nào" };
    }
    return foundUser;
  };
  static getAllProductForAdmin = async () => {
    const foundProduct = await productSchema
      .find()
      .populate("product_shop")
      .populate("category");
    if (foundProduct.length === 0) {
      return { message: "Chưa có Sản phẩm nào" };
    }
    return foundProduct;
  };
  static getAllCategoryForAdmin = async () => {
    const foundCategory = await categorySchema.find();
    if (foundCategory.length === 0) {
      return { message: "Chưa có loại sản phẩm nào" };
    }
    return foundCategory;
  };
  static getAllOrderForAdmin = async () => {
    const foundOrder = await orderSchema.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "order_userId",
          foreignField: "_id",
          as: "order_userId",
        },
      },
      {
        $addFields: {
          userInforId: "$order_userId.information",
        },
      },
      {
        $lookup: {
          from: "informations",
          localField: "userInforId",
          foreignField: "_id",
          as: "informations",
        },
      },
      {
        $addFields: {
          convertShopIds: {
            $map: {
              input: "$order_products",
              as: "product",
              in: {
                $toObjectId: "$$product.shopId",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "storeDetails",
          localField: "convertShopIds",
          foreignField: "_id",
          as: "storeDetails",
        },
      },
      {
        $addFields: {
          convertProductIds: {
            $map: {
              input: "$order_products",
              as: "product",
              in: {
                $map: {
                  input: "$$product.item_products",
                  as: "item",
                  in: {
                    $toObjectId: "$$item.productId",
                  },
                },
              },
            },
          },
        },
      },
      {
        $unwind: "$convertProductIds",
      },
      {
        $lookup: {
          from: "products",
          localField: "convertProductIds",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $group: {
          _id: "$_id",
          order_userId: { $first: "$informations" },
          order_checkout: { $first: "$order_checkout" },
          order_shipping: { $first: "$order_shipping" },
          order_products: {
            $push: {
              shopId: { $first: "$storeDetails" },
              shop_discounts: { $first: "$order_products.shop_discounts" },
              priceRaw: { $first: "$order_products.priceRaw" },
              priceApplyDiscount: {
                $first: "$order_products.priceApplyDiscount",
              },
            },
          },
          item_products: {
            $push: {
              price: { $first: "$order_products.item_products.price" },
              quantity: { $first: "$order_products.item_products.quantity" },
              productId: { $first: "$productDetails" },
            },
          },
          order_trackingNumber: { $first: "$order_trackingNumber" },
          order_status: { $first: "$order_status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $sort: { createdAt: -1 }, // 1 để sắp xếp theo thứ tự tăng dần, -1 để sắp xếp theo thứ tự giảm dần
      },
    ]);
    return foundOrder;
  };
  static getAllDiscountForAdmin = async () => {
    const foundDiscount = await discountSchema.find().populate({
      path: "discount_shopId",
    });
    if (foundDiscount.length === 0) {
      return { message: "Chưa có mã giảm giá nào" };
    }
    return foundDiscount;
  };
  static getStatistical = async () => {
    const productByYear = await productSchema.aggregate([
      {
        $group: {
          _id: { $year: { $toDate: "$createdAt" } }, // Trích xuất năm từ trường createdAt
          productCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    const countProducts = await productSchema.find().count();
    const userByYear = await userSchema.aggregate([
      {
        $match: {
          role: "User",
        },
      },
      {
        $group: {
          _id: { $year: { $toDate: "$createdAt" } }, // Trích xuất năm từ trường createdAt
          userCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    const countUsers = await userSchema.find({ role: "User" }).count();
    const shopByYear = await userSchema.aggregate([
      {
        $match: {
          role: "Shop",
        },
      },
      {
        $group: {
          _id: { $year: { $toDate: "$createdAt" } }, // Trích xuất năm từ trường createdAt
          shopCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    const countShops = await userSchema.find({ role: "Shop" }).count();
    const orderByYear = await orderSchema.aggregate([
      {
        $group: {
          _id: { $year: { $toDate: "$createdAt" } }, // Trích xuất năm từ trường createdAt
          ordertCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);
    const countOrders = await orderSchema.find().count();
    const topProductSold = await productSchema
      .find()
      .sort({ product_sold: -1 })
      .limit(5);
    const countCategory = await categorySchema.findOne().count();
    const mergedData = {};
    const yearsToInclude = [2022, 2023, 2024];

    // Khởi tạo đối tượng gộp với các giá trị mặc định là 0
    yearsToInclude.forEach((year) => {
      mergedData[year] = {
        _id: year,
        productCount: 0,
        userCount: 0,
        shopCount: 0,
        orderCount: 0,
      };
    });

    [productByYear, userByYear, shopByYear, orderByYear].forEach((data) => {
      data.forEach((item) => {
        // Nếu năm chưa tồn tại trong đối tượng gộp, tạo mới
        if (!mergedData[item._id]) {
          mergedData[item._id] = {
            _id: item._id,
            productCount: 0,
            userCount: 0,
            shopCount: 0,
            orderCount: 0,
          };
        }

        // Gộp thông tin từ mảng hiện tại vào đối tượng gộp
        Object.assign(mergedData[item._id], item);
      });
    });
    return {
      countUsers,
      countShops,
      countProducts,
      countOrders,
      countCategory,
      mergedData,
      topProductSold,
    };
  };
  static async getShopDetail({ shopId }) {
    const shop = await userSchema.findOne({ _id: shopId });
    const storeDetail = await storeDetailsSchema.findOne({ _id: shopId });
    const getProductInShop = await productSchema.findOne({
      product_shop: shopId,
    });
    return {
      message: "Chi tiết cửa hàng",
      shop,
      storeDetail,
      getProductInShop,
    };
  }
  static unpublishedProductByAdmin = async ({
    userId,
    shopId,
    content,
    productId,
  }) => {
    const product = await productSchema.findOneAndUpdate(
      { _id: productId },
      {
        $set: {
          isPublished: false,
          isDraft: true,
        },
      },
      { new: true }
    );
    const createNotification = await notificationSchema.create({
      noti_type: "admin-001",
      noti_senderId: userId,
      noti_receiveId: shopId,
      noti_content: content,
    });
    const shopToken = await keyTokenSchema.findOne({ user: shopId });

    return {
      message: "Unpublished product successfully",
      product,
      createNotification,
    };
  };
  static getTradingHistory = async ({ orderId }) => {
    const getTradeing = await orderSchema.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(orderId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "order_userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Unwind the user array created by $lookup
      },
      {
        $lookup: {
          from: "informations",
          localField: "user.information",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $addFields: {
          convertedShopId: {
            $map: {
              input: "$order_products",
              as: "product",
              in: {
                $toObjectId: "$$product.shopId",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "convertedShopId",
          foreignField: "_id",
          as: "shopInOrder",
        },
      },
      {
        $unwind: "$order_products",
      },
      {
        $addFields: {
          tempProductId: {
            $map: {
              input: "$order_products.item_products",
              as: "item",
              in: { $toObjectId: "$$item.productId" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "tempProductId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $group: {
          _id: "$_id",
          order_userId: { $first: "$userInfo" },
          order_checkout: { $first: "$order_checkout" },
          order_shipping: { $first: "$order_shipping" },
          order_trackingNumber: { $first: "$order_trackingNumber" },
          order_status: { $first: "$order_status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          __v: { $first: "$__v" },
          shopInOrder: { $first: "$shopInOrder" },
          order_products: { $push: "$order_products" },
          productInfo: { $push: "$productInfo" },
        },
      },
      {
        $project: {
          convertedShopId: 0,
          "user.information": 0,
        },
      },
    ]);

    return {
      getTradeing,
    };
  };
  static getStatisticalShop = async ({ shopId }) => {
    const allMonths = [...Array(12).keys()].map((month) => month + 1);

    const result = await orderSchema.aggregate([
      {
        $match: {
          "order_products.shopId": shopId,
          order_status: "delivered",
        },
      },
      {
        $addFields: {
          order_month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: { month: "$order_month" },
          totalRevenue: { $sum: "$order_checkout.totalCheckout" },
        },
      },
      {
        $sort: {
          "_id.month": 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          totalRevenue: 1,
        },
      },
    ]);
    const resultMap = new Map(
      result.map((entry) => [entry.month, entry.totalRevenue])
    );

    // Tạo danh sách revenue với tất cả các tháng trong năm
    const revenue = allMonths.map((month) => ({
      month: month,
      totalRevenue: resultMap.get(month) || 0,
    }));
    revenue;
    const topProductSold = await productSchema
      .find({ product_shop: shopId })
      .limit(5)
      .sort({ product_sold: -1 });
    return {
      message: "getStatisticalShop",
      revenue,
      topProductSold,
    };
  };
  static disable = async ({ userId }) => {
    const userDisabled = await userSchema.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          disable: true,
        },
      }
    );
    if (!userDisabled) return { message: "Vô hiệu hóa tài khoản thất bại" };
    return {
      message: "Vô hiệu hóa tài khoản thành công",
      userDisabled,
    };
  };
  static getUser = async ({ userId }) => {
    const user = await userSchema
      .findOne({ _id: userId })
      .select("-password")
      .populate({
        path: "information",
        populate: {
          path: "address",
          options: { strictPopulate: false },
        },
      });
    const order = await orderSchema.aggregate([
      {
        $match: {
          order_userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "order_userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: "$user", // Unwind the user array created by $lookup
      },
      {
        $lookup: {
          from: "informations",
          localField: "user.information",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $addFields: {
          convertedShopId: {
            $map: {
              input: "$order_products",
              as: "product",
              in: {
                $toObjectId: "$$product.shopId",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "convertedShopId",
          foreignField: "_id",
          as: "shopInOrder",
        },
      },
      {
        $unwind: "$order_products",
      },
      {
        $addFields: {
          tempProductId: {
            $map: {
              input: "$order_products.item_products",
              as: "item",
              in: { $toObjectId: "$$item.productId" },
            },
          },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "tempProductId",
          foreignField: "_id",
          as: "productInfo",
        },
      },
      {
        $group: {
          _id: "$_id",
          order_userId: { $first: "$userInfo" },
          order_checkout: { $first: "$order_checkout" },
          order_shipping: { $first: "$order_shipping" },
          order_trackingNumber: { $first: "$order_trackingNumber" },
          order_status: { $first: "$order_status" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          __v: { $first: "$__v" },
          shopInOrder: { $first: "$shopInOrder" },
          order_products: { $push: "$order_products" },
          productInfo: { $push: "$productInfo" },
        },
      },
      {
        $project: {
          convertedShopId: 0,
          "user.information": 0,
        },
      },
    ]);
    return {
      user,
      order,
    };
  };
}

module.exports = AdminService;

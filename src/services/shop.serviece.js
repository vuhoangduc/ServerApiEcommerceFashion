const storeDetailsSchema = require("../models/storeDetails.model");
const userSchema = require("../models/user.model");
const productSchema = require("../models/product.model");
const orderShema = require("../models/orderV2.model");
const { BadRequestError, StatusCode } = require("../core/error.response");
class ShopService {
  static updateShop = async (
    avatarShop,
    { shopId, nameShop, phoneNumberShop, des, emailShop, address }
  ) => {
    try {
      const findStoreDetail = await storeDetailsSchema.findOne({ _id: shopId });
      let storeDetails;

      if (!findStoreDetail) {
        const checkShopAvailable = await storeDetailsSchema.findOne({
          $or: [{ phoneNumberShop }, { emailShop }, { nameShop }],
        });

        if (checkShopAvailable) {
          return { message: "Shop already exists", status: 404 };
        }

        storeDetails = await storeDetailsSchema.create({
          _id: shopId,
          nameShop,
          phoneNumberShop,
          avatarShop: avatarShop,
          des,
          emailShop,
          address,
        });
      } else {
        storeDetails = await storeDetailsSchema.findByIdAndUpdate(
          { _id: shopId },
          {
            $set: {
              nameShop,
              phoneNumberShop,
              avatarShop: avatarShop,
              des,
              emailShop,
              address,
            },
          },
          { new: true }
        );
      }

      if (!storeDetails) {
        return { message: "Có lỗi khi update shop!" };
      }

      return {
        message: "Cập nhật thành công!!",
        shop: storeDetails,
      };
    } catch (error) {
      return {
        message: "Có lỗi khi update shop!",
      };
    }
  };

  static searchProduct = async ({ shopId, nameSearch }) => {
    try {
      const query = {
        product_shop: shopId,
        product_name: new RegExp(nameSearch, "i"),
      };
      const products = await productSchema.find(query);

      if (!products || products.length === 0) {
        return { message: "Không tìm thấy sản phẩm nào trong cửa hàng!" };
      }

      return {
        message: "Tìm kiếm thành công!!",
        products,
      };
    } catch (error) {
      console.error("Lỗi khi tìm kiếm sản phẩm:", error);
      return { message: "Có lỗi khi tìm kiếm sản phẩm trong cửa hàng!" };
    }
  };

  static getShop = async ({ shopId }) => {
    const resShop = {};
    const shop = await storeDetailsSchema
      .findById(shopId)
      .select("-createdAt -updatedAt");
    const productOfShop = await productSchema
      .find({ product_shop: shop._id, isPublished: true })
      .select(
        "-product_description -product_attributes -createdAt -updatedAt -product_slug"
      );
    resShop.shop = shop;
    resShop.products = productOfShop;
    return resShop;
  };
  static getShopForShop = async ({ shopId }) => {
    const shop = await storeDetailsSchema
      .findById(shopId)
      .select("-createdAt -updatedAt");
    if (!shop) {
      throw new BadRequestError(
        "Bạn chưa cập nhật thông tin shop",
        StatusCode.FORBIDDEN,
        "INVALID_EMAIL"
      );
    }
    return shop;
  };

  static orderStatistics = async ({ shopId, year }) => {
    const foundOrder = await orderShema.aggregate([
      {
        $match: {
          "order_products.shopId": shopId,
          createdAt: {
            $gte: new Date(`${year}-01-01T00:00:00.000Z`),
            $lt: new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`),
          },
          order_status: "delivered",
        },
      },
      {
        $group: {
          _id: {
            order_userId: "$order_userId",
          },
          totalCheckout: { $sum: "$order_checkout.totalCheckout" },
          totalOrders: { $sum: 1 },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: null,
          totalCheckout: { $sum: "$totalCheckout" },
          totalOrders: { $sum: "$totalOrders" },
          customerCount: { $sum: 1 },
        },
      },
    ]);
    const foundProduct = await productSchema
      .find({ product_shop: shopId })
      .sort({ product_sold: 1 })
      .select(
        "-product_attributes -product_ratingAverage -product_variation -createdAt -updatedAt -product_slug"
      );
    const foundShop = await storeDetailsSchema.findById(shopId);
    foundOrder[0].totalProduct = foundProduct.length;
    foundOrder[0].totalFollow = foundShop.follower.length;
    foundOrder[0].topSold = [];
    if (foundProduct.length <= 10) {
      foundOrder[0].topSold = foundProduct;
    } else {
      for (let i = foundProduct.length - 1; i >= 0; i--) {
        foundOrder[0].topSold.push(foundProduct[i]);
        if (foundOrder[0].topSold.length === 10) {
          break;
        }
      }
    }
    return foundOrder;
  };
  static analysis = async ({ shopId, query }) => {
    const allMonths = [...Array(12).keys()].map((month) => month + 1);

    const result = await orderShema.aggregate([
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
    return {
      message: "getStatisticalShop",
      revenue,
    };
  };
}
module.exports = ShopService;

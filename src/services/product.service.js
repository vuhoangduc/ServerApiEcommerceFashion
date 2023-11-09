const productSchema = require('../models/product.model');
const reviewSchema = require('../models/review.model');
const shopSchema = require('../models/storeDetails.model');
const { findAllDraftsForShop,
    publishProductByShop,
    findAllPublicForShop,
    unpublishProductByShop
} = require('../models/repositories/product.repo')
class ProductService {
    static createProduct = async (thumb,{ product_shop,product_name,
        product_description,
        product_price,
        category,
        product_attributes }) => {
        thumb = ['1697547165728-iphone-13-pro-max.png',
                '1697547165728-iphone-13-pro-max.png',
                '1697547165728-iphone-13-pro-max.png',
                '1697547165728-iphone-13-pro-max.png'
                ];
    const sumQuanity = await product_attributes.reduce((total,item)=>total+item.quantity,0);
    const newProduct = await productSchema.create({
        product_name:product_name,
        product_thumb:thumb,
        product_description:product_description,
        product_price:product_price,
        category:category,
        product_shop:product_shop,
        product_attributes:product_attributes,
        product_quantity:sumQuanity
    });
    if(!newProduct) return{message: 'cố lỗi khi tạo sản phẩm'};
    return{
        message:'Tạo sản phẩm thành công',
        newProduct:newProduct
    }
}
static reviewProduct = async ({ user_id, product_id, rating, comment }) => {
    try {
        console.log(user_id);
        console.log(product_id);
        const review = await reviewSchema.create({
            user: user_id,
            product: product_id,
            rating: rating,
            comment: comment
        });

        const allReview = await reviewSchema.find({});
        let totalRating = 0;

        allReview.forEach(element => {
            totalRating += element.rating;
        });
        const averageRating = totalRating / allReview.length;
        console.log(averageRating);
        const updateRatingProduct = await productSchema.findByIdAndUpdate(
            { _id: product_id },
            { $set: { product_ratingAverage: averageRating } }
        );
        return {
            message: 'Đánh giá thành công'
        };
    } catch (error) {
        return {
            message: 'Có lỗi xảy ra khi đánh giá sản phẩm'
        };
    }
}

    static editProduct = async (thumb,{product_id,product_name,
        product_description,
        product_price,
        category,
        product_attributes }) =>{
            thumb = ['1697547165728-iphone-13-pro-max.png',
            '1697547165728-iphone-13-pro-max.png',
            '1697547165728-iphone-13-pro-max.png',
            '1697547165728-iphone-13-pro-max.png'
            ];
        const product = await productSchema.findByIdAndUpdate(
            {_id:product_id},
            {$set:
            {
                product_thumb:thumb,
                product_name:product_name,
                product_description:product_description,
                product_price:product_price,
                category:category,
                product_attributes:product_attributes,
            }}
        );
        if(!product) return {message:'Có lỗi sảy ra bạn ko thể update sản phẩm này!!!'};
        return{
            message:'Bạn đã cập nhật sản phẩm thành công',
        }
    }
    static deleteProduct = async ({product_id})=>{
        
    }

static async publishProductByShop({ product_shop, product_Id }) {
    return await publishProductByShop({ product_shop, product_Id })
}

static async unpublishProductByShop({ product_shop, product_Id }) {
    return await unpublishProductByShop({ product_shop, product_Id })
}

static async getAllProductByShop({product_shop}){
    const allProduct = await productSchema.find({product_shop:product_shop});
    if(!allProduct) return {message:'Shop của bạn chưa có bất cứ sản phẩm nào'};
    return{
        message:'Lấy tất cả sản phẩm thành công!!',
        allProduct:allProduct
    }
}

static async getAllProductByUser(){
    const allProduct = await productSchema.find();
    if(!allProduct || allProduct.length === 0) return {message:'Không có sản phẩm nào'};
    return{
        message:'Lấy tất cả sản phẩm thành công!!',
        allProduct:allProduct
    }
}

static async getProduct({product_id}){
    console.log(product_id);
    const resProduct ={};
    const product = await productSchema.findById(product_id);
    const shop = await shopSchema.findById(product.product_shop);
    const reviews = await reviewSchema.find({product:product._id})
    .populate({
        path:'user',
        select:'user_name'
    });
    resProduct.product_name = product.product_name;
    resProduct.product_price = product.product_price;
    resProduct.product_thumb = product.product_thumb;
    resProduct.product_description = product.product_description;
    resProduct.product_price = product.product_price;
    resProduct.product_quantity = product.product_quantity;
    resProduct.category = product.category;
    resProduct.product_attributes = product.product_attributes;
    resProduct.product_ratingAverage = product.product_ratingAverage;
    resProduct.shop_name = shop.nameShop;
    resProduct.shop_avatar = shop.avatarShop;
    resProduct.reviews = reviews==''?'Chưa có đánh giá nào':reviews;
    return resProduct;
}

}
module.exports = ProductService;
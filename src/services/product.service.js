const productSchema = require('../models/product.model');
const reviewSchema = require('../models/review.model');
const shopSchema = require('../models/storeDetails.model');
const { findAllDraftsForShop,
    publishProductByShop,
    findAllPublicForShop,
    unpublishProductByShop
} = require('../models/repositories/product.repo');
const { json } = require('express');
const { insertInventory } = require('../models/repositories/inventory.repo');
class ProductService {
    static createProduct = async (thumbs, { product_shop, product_name, product_description, product_price, category, product_attributes }) => {
        try {
            console.log(thumbs);
            let arrThumb = [];
            if(thumbs.length<3){
                arrThumb = [
                    '',
                    '',
                ]
            }else{
                arrThumb = await Promise.all(thumbs.map(async (thumb) => {
                    return thumb.filename;
                }));
            }
            const productAttributesJSON = JSON.parse(product_attributes);
            const sumQuanity = productAttributesJSON.reduce((total, item) => total + item.quantity, 0);
            const newProduct = await productSchema.create({
                product_name: product_name,
                product_thumb: arrThumb,
                product_description: product_description,
                product_price: product_price,
                category: category,
                product_shop: product_shop,
                product_attributes: productAttributesJSON,
                product_quantity: sumQuanity
            });
            if (!newProduct) {
                return { message: 'Có lỗi khi tạo sản phẩm' };
            }
            if(newProduct){
                // add product_stock in inventory collection
                await insertInventory({
                    productId:newProduct._id,
                    shopId:newProduct.product_shop,
                    stock:newProduct.product_quantity,
                })
                // push noti system
                // pushNotiToSystem({
                //     type:'shop-001',
                //     receivedId:1,
                //     senderId:newProduct.product_shop,
                //     options:{
                //         product_name:product_name,
                //         shop_name:product_shop
                //     }
                // }).then(rs => console.log(rs))
                // .catch(console.error)
            }
            return {
                message: 'Tạo sản phẩm thành công',
            };
        } catch (error) {
            console.error('Lỗi trong quá trình tạo sản phẩm:', error);
            return { message: 'Có lỗi khi tạo sản phẩm' };
        }
    };
    
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

    static editProduct = async (thumbs,{product_id,product_name,
        product_description,
        product_price,
        category,
        product_attributes }) =>{
            const arrthumb = await Promise.all(thumbs.map(async (thumb) => {
                return thumb.filename;
            }));
            const productAttributesJSON = JSON.parse(product_attributes);
        const product = await productSchema.findByIdAndUpdate(
            {_id:product_id},
            {$set:
            {
                product_thumb:arrthumb,
                product_name:product_name,
                product_description:product_description,
                product_price:product_price,
                category:category,
                product_attributes:productAttributesJSON,
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


static async getAllProductByShop({ product_shop, query }) {
    let allProducts = [];
    switch (query) {
        case 'all':
            allProducts = await productSchema.find({ product_shop: product_shop,isDraft:false });
            break;
        case 'con_hang':
            allProducts = await productSchema.find({ product_shop: product_shop,isDraft:false ,product_quantity: { $gt: 0 } });
            break;
        case 'het_hang':
            allProducts = await productSchema.find({ product_shop: product_shop, product_quantity:0});
        break;
        case 'private':
            allProducts = await productSchema.find({ product_shop: product_shop, isDraft:true});
        break;
        default:
            break;
    }

    if (!allProducts || allProducts.length === 0) {
        return { message: 'Shop của bạn chưa có bất kỳ sản phẩm nào' };
    }

    return allProducts;
}
static async getAllNameProductByShop({product_shop}){
    const foundProducts = await productSchema.find({product_shop:product_shop});
    if(!foundProducts) return {message:'Shop của bạn chưa có bất cứ sản phẩm nào'};
    const nameProducts =[];
    for (let i = 0; i < foundProducts.length; i++) {
        nameProducts.push(foundProducts[i].product_name);
    }
    const uniqueNameProducts = [...new Set(nameProducts)];
    return uniqueNameProducts;
}
static async findProductByName({product_shop,product_name}){
    console.log(product_name);
    const foundProducts = await productSchema.find({product_shop:product_shop,product_name:product_name});
    if(!foundProducts) return {message:'Shop của bạn chưa có bất cứ sản phẩm nào'};
    return foundProducts;
}
static async getAllProductByUser(){
    const allProduct = await productSchema.find({isPublished: false});
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
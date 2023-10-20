const productSchema = require('../models/product.model');
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
    const allProduct = await productSchema.find({isPublished: false});
    if(!allProduct || allProduct.length === 0) return {message:'Không có sản phẩm nào'};
    return{
        message:'Lấy tất cả sản phẩm thành công!!',
        allProduct:allProduct
    }
}

}
module.exports = ProductService;
const cartSchema = require('../models/cart.model');
const shopSchema = require('../models/storeDetails.model');

class CartService {
    static createCart = async ({ userId }) => {
        const newCart = cartSchema.create({
            userId
        })
        if (!newCart) return { message: 'Việc tạo giỏ hàng sảy ra lỗi' };
        return {
            message: 'Tạo giỏ hàng thành công'
        }
    }
    static addToCart = async ({ userId, products }) => {
        const cart = await cartSchema.findOneAndUpdate(
            { userId: userId },
            {
                $push: { products: { $each: products} }
            },
            { new: true, upsert: true }
        );
        if (!cart) {
            return { message: 'Việc thêm sản phẩm vào giỏ hàng có vấn đề!!!' };
        }
        return { message: 'Thêm sản phẩm vào giỏ hàng thành công!!!' };
    }

    static getCart = async ({userId})=>{
        const cart = await cartSchema.findOne({
            userId:userId
        }).populate({
            path: 'products.product_id',
            select: 'product_name product_thumb product_price product_shop',
        });
        if (!cart) return {message:'Giỏ hàng của bạn chưa có sản phẩm nào'};
        let totalPrice = 0;
        for (const product of cart.products) {
            const price = parseFloat(product.product_id.product_price); // Chuyển giá thành số nếu nó là một chuỗi
            const quantity = product.quantity;
            totalPrice += price * quantity;
        }
        cart.totalPrice = totalPrice;
        for (let i = 0; i < cart.products.length; i++) {
            for (let j = 0; j < cart.products[i].product_id.product_thumb.length; j++) {
                cart.products[i].product_id.product_thumb[j] = `https://1f79-116-96-46-69.ngrok-free.app/uploads/`+cart.products[i].product_id.product_thumb[j];
            }
        }
        const resProduct = [];
        for ( let i = 0; i < cart.products.length; i++){
            const e = cart.products[i].product_id;
            const shop = await shopSchema.findOne({_id:e.product_shop})
            resProduct.push({
                product_id:e._id,
                product_name:e.product_name,
                product_thumb:e.product_thumb[0],
                product_price:e.product_price,
                product_shop:e.product_shop,
                product_quantity:cart.products[i].quantity,
                color:cart.products[i].color,
                size:cart.products[i].size,
                name_shop:shop.nameShop,
                avatar_shop:'https://1f79-116-96-46-69.ngrok-free.app/uploads/'+shop.avatarShop,
            })
        }
        const resCart = {
            cartId:cart._id,
            products:resProduct
        };
        return{
            message:'Lấy các sản phẩm trong giỏ hàng thành công',
            cart:resCart
        }
    }
}
module.exports = CartService;
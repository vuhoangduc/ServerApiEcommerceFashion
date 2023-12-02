const cartV2Model = require('../models/cartV2.model');
const cartModel = require('../models/cartV2.model');
const productModel = require('../models/product.model');
const shopSchema = require('../models/storeDetails.model');
const { getProductById } = require('../models/repositories/product.repo');
/*
    Key features :Cart Service
    - add product to cart [user],
    - reduce product quantity by one [user],
    - increase product quantity by one [user],
    - get cart [user],
    - Delete cart [user],
    - Delete cart item [user]
*/

class CartV2Service {
    // START REPO CART ///
    static async createUserCart({userId,product}){
        const query = {cart_userId:userId, cart_state:'active'},
        updateOrIssert = {
            $addToSet:{
                cart_products:product
            }
        },
        options = {upsert:true, new:true}
        return await cartModel.findOneAndUpdate(query,updateOrIssert,options);
    }
    static async updateUserCartQuantity({ userId, product }) {
        const { productId, quantity, color, size } = product;
        console.log({productId,quantity,size,color});
        const query = {
            cart_userId: userId,
            cart_products: {
                $elemMatch: {
                    productId: productId,
                    color: color,
                    size: size
                }
            }
        };
        const updateSet = {
            $inc: {
                'cart_products.$.quantity': quantity
            }
        };
        const options = { upsert: true, new: true };
        return await cartModel.findOneAndUpdate(query, updateSet, options);
    }
    // END REPO CART ///
    static async addToCart({userId,product}){
        // check cart ton tai hay ko?
        const userCart = await cartModel.findOne({cart_userId:userId})
        if(!userCart){
            // create cart for user
            return await CartV2Service.createUserCart({userId,product});
        }
        if(!userCart.cart_products.length){
            userCart.cart_products = [product];
            return await userCart.save();
        }
        const { cart_products } = userCart;
        // tim ra product co id trung với id trong cart
        const existingProduct = cart_products.find(p => p.productId === product.productId);
        const foundProduct= cart_products.find(item => item.productId === product.productId
            && item.color === product.color
            && item.size === product.size);
        if(!foundProduct){
            userCart.cart_products.push(product)
            return await userCart.save();
        }
        // gio hang ton tai va co san pham nay thi update quantity
        return await CartV2Service.updateUserCartQuantity({userId,product});
    }
    // update
    /*
        shop_order_id:[
            shopId,
            item_product:[
                {
                    quantity,
                    price,
                    shopId,
                    old_quantity,
                    productId
                }
            ],
            version
        ]
    */
    static async updateCart({userId,shop_order_ids}){
        const {productId,quantity,old_quantity,size,color} = shop_order_ids[0]?.item_product[0];
        // check product
        const foundProduct = await getProductById(productId);
        if(!foundProduct) return {message:'Product '}
        // compare
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            return {message:'Product do not belong to the shop'}
        }
        if(quantity === 0){
            deleteUserCart(userId,productId)
        }
        return await CartV2Service.updateUserCartQuantity({
            userId,
            product:{
                productId,
                quantity:quantity - old_quantity,
                size,
                color
            },
        }
        )
    }

    static async deleteUserCart({userId,productId}){
        console.log({userId,productId});
        const query = {cart_userId:userId,cart_state:'active'},
        updateSet={
            $pull:{
                cart_products:{
                    productId
                }
            }
        }
        const deleteCart = await cartModel.updateOne(query,updateSet);
        return deleteCart;
    }

    static async getListUserCart({userId}){
        return await cartModel.findOne({
            cart_userId: +userId
        }).lean()
    }
    static getCart = async ({userId})=>{
        const cart = await cartV2Model.findOne({
            cart_userId:userId
        }).select('-cart_state,-__v,-cart_count_product,-createdAt,-updatedAt');
        if (!cart) return {message:'Giỏ hàng của bạn chưa có sản phẩm nào'};
        for (let i = 0; i < cart.cart_products.length; i++) {
            const product = cart.cart_products[i];
            const foundProduct = await productModel.findById(product.productId);
            const foundShop = await shopSchema.findOne({_id:product.shopId});
            cart.cart_products[i].product_thumb = foundProduct.product_thumb[0];
            cart.cart_products[i].name_shop=foundShop.nameShop,
            cart.cart_products[i].avatar_shop=foundShop.avatarShop

        }
        return{
            message:'Lấy các sản phẩm trong giỏ hàng thành công',
            cart:cart
        }
    }

}

module.exports = CartV2Service
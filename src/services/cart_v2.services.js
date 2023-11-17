const cartV2Model = require('../models/cartV2.model');
const cartModel = require('../models/cartV2.model');
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
    static async updateUserCartQuantity({userId,product}){
        const {productId,quantity} = product;

        const query = {
            cart_userId:userId,
            'cart_products.productId':productId
        },updateSet = {
            $inc:{
                'cart_products.$.quantity':quantity
            }
        },options = {upsert:true,new:true}

        return await cartModel.findOneAndUpdate(query,updateSet,options);
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
        const productIndex = userCart.cart_products.findIndex(p => p.productId === product.productId);
        if(productIndex === -1){
            userCart.cart_products.push(product)
            return await userCart.save();
        }
        // gio hang ton tai va co san pham nay thi update quantity
        return await CartV2Service.updateUserCartQuantity({userId,product})
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
        const {productId,quantity,old_quantity} = shop_order_ids[0]?.item_product[0],
        // check product
        foundProduct = await getProductById(productId);
        if(!foundProduct) return {message:'Product '}
        // compare
        if(foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId){
            return {message:'Product do not belong to the shop'}
        }
        if(quantity === 0){
            // deleted
        }
        return await CartV2Service.updateUserCartQuantity({
            userId,
            product:{
                productId,
                quantity:quantity - old_quantity
            }
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

}

module.exports = CartV2Service
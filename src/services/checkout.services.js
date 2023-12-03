

const {
    findCartId
} = require('../models/repositories/cart.repo');
const {
    checkProductByServer
} = require('../models/repositories/product.repo');
const { getDiscountAmount } = require('./discount.services');
const { acquirelock } = require('./redis.services');
const orderV2Schema = require('../models/orderV2.model');
const productSchema = require('../models/product.model');
const cartv2Schema = require('../models/cartV2.model');
const inventorySchema = require('../models/inventory.model');
const storeDetailSchema = require('../models/storeDetails.model')
const { findById } = require('../services/userSchema.services');
const { reservationInventory } = require('../models/repositories/inventory.repo');
const { pushNotiToSystem } = require('./notification.services');
const { converToObjectIdMongodb } = require('../util');
const { BadRequestError, StatusCode } = require('../core/error.response');
class CheckoutService {

    /*
        {
            cartId,
            userId,
            shop_order_ids:[
                {
                    shopId,
                    shop_discount:[],
                    item_products:[
                    {
                        price,
                        quantity,
                        productId
                    }
                    ]
                },
                {
                    shopId,
                    shop_discount:[
                        {
                            "shopId",
                            "discountId",
                            "codeId"
                        }
                    ],
                    item_products:[
                    {
                        price,
                        quantity,
                        productId
                    }
                ]
                },

            ]
        }
    */
    static  async checkoutReview({
        cartId,userId,shop_order_ids,type
    }){
        if(type!='mua-ngay'){
        // check cartId ton tai ko?
        const foundCart = await findCartId(cartId)
        if(!foundCart) return {message:'ko tim thay gio hang'};
        }
        const checkout_order = {
            totalPrice: 0,// tong tien hang
            feeShip:0, // phi van chuyen
            totalDiscount:0,//tong tien discount giam gia
            totalCheckout:0,// tong thanh toan
        },shop_order_ids_new = [];
        for (let i = 0; i < shop_order_ids.length; i++) {
            const {shopId,shop_discounts = [],item_products = []} =shop_order_ids[i];
            // check product available
            const checkProductServer = await checkProductByServer(item_products);
            console.log(checkProductServer);
            if(!checkProductServer[0]) return {message:'oder wrong!!'};
            // tong tien don hang
            const checkoutPrice = checkProductServer.reduce((acc,product) =>{
                return acc + (product.quantity * product.price)
            },0)
            // tong tien truoc khi xu ly
            checkout_order.totalPrice += checkoutPrice
            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount:checkoutPrice,
                item_products:checkProductServer
            }
            // neu shop_discounts ton tai > 0, check xem co hop le hay khong
            if(shop_discounts.length > 0){
                // gia su chi co mot discount
                // get amout discount
                const {totalPrice=0,discount=0} = await getDiscountAmount({
                    codeId : shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products:checkProductServer
                })
                // tong cong discont giam gia
                checkout_order.totalDiscount += discount
                // neu tien giam gia lon hon ko
                if(discount > 0){
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }
            // tong thanh toan cuoi cung
            checkout_order.totalCheckout += itemCheckout.priceApplyDiscount;
            shop_order_ids_new.push(itemCheckout);
        }
        return{
            shop_order_ids,
            shop_order_ids_new,
            checkout_order
        }
    }

    static async orderByUser({
        shop_order_ids,
        cartId,
        userId,
        user_address = {City:'Hà nội'},
        user_payment = {}
    }){
        let newOrder = [];
        await Promise.all(shop_order_ids.map(async(shop_order_ids)=>{
        const {shop_order_ids_new,checkout_order} = await CheckoutService.checkoutReview({
            cartId,
            userId,
            shop_order_ids:[shop_order_ids]
        })
        // check lai mot lan nua xem vuot ton kho hay ko?
        const products = shop_order_ids_new.flatMap(order => order.item_products);
        const acquireProduct = [];
        for (let i = 0; i < products.length; i++) {

            const {productId,quantity,color,size,} = products[i];
            const keyLock = await acquirelock(productId,quantity,cartId,color,size);
            if(keyLock == false){
                pushNotiToSystem({
                    type:'order-002',
                    receivedId:1,
                    senderId:shop_order_ids_new[0].shopId,
                    options:{
                        productId:productId,
                    }
                })
                throw new BadRequestError('Sản phẩm đã có cập nhật mới, vui lòng kiểm tra lại có thể là số lượng ko đủ', StatusCode.FORBIDDEN, 'INVALID_EMAIL');
            }
            // acquireProduct.push(keyLock ? true:false);
            // if(keyLock){
            //     await releaselock(keyLock)
            // }
        }
        // // check if co 1 san pham het hang trong kho
        // if(keyLock == false){
        //     return {message: 'Mot so san pham da duoc cap nhat, vui long quay lai gio hang...'};
        // }
        newOrder = await orderV2Schema.create({
            order_userId:userId,
            order_checkout:checkout_order,
            order_shipping:user_address,
            order_payment:user_payment,
            order_products:shop_order_ids_new,
        })
        // truong hop: neu insert thanh cong, thi remove product co trong cart
        if (newOrder) {
            for (let i = 0; i < shop_order_ids_new.length; i++) {
            const productIdToRemove = shop_order_ids_new[i].item_products[0].productId;
            try {
                const result = await cartv2Schema.updateOne(
                { "cart_userId": userId },
                { $pull: { "cart_products": { "productId": productIdToRemove } } }
                );
                pushNotiToSystem({
                    type:'order-001',
                    receivedId:1,
                    senderId:userId,
                    options:{
                        productId:productIdToRemove,
                        orderId:newOrder._id
                    }
                })
                // Kết quả của updateOne được trả về trực tiếp
                console.log(`Đã xoá sản phẩm với productId ${productIdToRemove}`);
            } catch (error) {
                console.error(`Lỗi khi xoá sản phẩm từ giỏ hàng: ${error}`);
            }
            }
        }
    }))
    return newOrder;
    }
    /*
        1> Query Order [User]
    */
    static async getOrdersByUser({ userId,query }){
        const orderRes = {
            user: [],
        };
        const foundOrders = await orderV2Schema.find({order_userId:userId,order_status:query}).lean();
        if (!foundOrders) return { message: 'Không có đơn hàng nào' };
        const shopOrder = [];
        const productOrder = [];

        for (let index = 0; index < foundOrders.length; index++) {
            const element = foundOrders[index];
            const findShop = await storeDetailSchema.findById(element.order_products[0].shopId);
            const findProductOder = await productSchema.findById(element.order_products[0].item_products[0].productId);
            orderRes.user.push(
            {
                oderId:element._id,
                status:element.order_status,
                name_shop: findShop.nameShop,
                shopId:findShop._id,
                avatar_shop:findShop.avatarShop,
                order_shipping:element.order_shipping,
                product_name: findProductOder.product_name,
                product_thumb:findProductOder.product_thumb,
                product_attributes:element.order_products[0].item_products[0],
                order_checkout:element.order_checkout,
                order_status:element.order_status,
                crateDate:element.createdAt
            }
        )
        }
        return {
            orderRes
        }
    }
    /*
        1> Query Order Using Id [User]
    */
        static async getOneOrderByUser(){
        
    }
    /*
        1> cancel Order [User]
    */
    static async cancelOrderByUser({orderId,userId}){
        const order = await orderV2Schema.findOneAndUpdate({ _id:orderId,order_userId:userId }, {
            $set: { order_status: 'cancelled' }
        }, { new: true })
        if (!order) {
            return {
                message: 'Hủy đơn hàng thất bại'
            }
        }
        return {
            message: 'Hủy đơn hàng thành công',
            order
        }
    }
    static async cancelOrderByShop({orderId,shopId}){
        const order = await orderV2Schema.findOneAndUpdate({ _id:orderId,"order_products.shopId":shopId }, {
            $set: { order_status: 'cancelled' }
        }, { new: true })
        if (!order) {
            return {
                message: 'Hủy đơn hàng thất bại'
            }
        }
        return {
            message: 'Hủy đơn hàng thành công',
            order
        }
    }
    /*
        1> Update Order Status [Shop | Admin]
    */
    static async updateOrderStatusByShop({ shopId,order_id, status }){
        console.log({shopId,order_id, status});
    const order = await orderV2Schema.findOneAndUpdate({ _id: order_id,"order_products.shopId":shopId }, {
        $set: { order_status: status }
    }, { new: true })
    if (!order) {
        return {
            message: 'Thay đổi trạng thái đơn hàng thất bại'
        }
    }
    return {
        message: 'Thay đổi trạng thái đơn hàng thành công',
        order
    }
}
static async updateOrderStatusByUser({ userId,order_id, status }){
const order = await orderV2Schema.findOneAndUpdate({ _id: order_id,order_userId:userId }, {
    $set: { order_status: status }
}, { new: true })
if (!order) {
    return {
        message: 'Thay đổi trạng thái đơn hàng thất bại'
    }
}
return {
    message: 'Thay đổi trạng thái đơn hàng thành công',
    order
}
}

    static getOrderByIdForShop = async ({ shopId,query }) => {
        const orderRes = {
            user: [],
        };
        const orders = await orderV2Schema.find({ "order_products.shopId": shopId,order_status:query }).lean();
        if (!orders || orders.length === 0) {
            return { message: 'Không có đơn hàng nào' };
        }
        const userOrder = [];
        const productOrder = [];
        for (let index = 0; index < orders.length; index++) {
            const element = orders[index];
            const findUserOder = await findById(element.order_userId);
            const findProductOder = await productSchema.findById(element.order_products[0].item_products[0].productId);
            productOrder.push(findProductOder);
            userOrder.push(findUserOder);
            orderRes.user.push(
            {
                oderId:element._id,
                status:element.order_status,
                user_name: findUserOder.information.fullName,
                order_shipping:element.order_shipping,
                phoneNumber:findUserOder.information.phoneNumber,
                product_name: findProductOder.product_name,
                product_thumb:findProductOder.product_thumb,
                product_attributes:element.order_products[0].item_products[0],
                order_checkout:element.order_checkout,
                order_status:element.order_status,
                crateDate:element.createdAt
            }
        )
        }
        return {
            orderRes
        }
    }

    
}

module.exports = CheckoutService
const cartSchema = require('../models/cart.model')
const orderItemSchema = require('../models/oderItem.model')
const orderSchema = require('../models/oder.model')
const productSchema = require('../models/product.model');
const socketManager = require('../util/socket_manager');
const { findById } = require('../services/userSchema.services');

class OrderService {

    static payInCart = async ({ userId, products }) => {
        let saveCreateOrderItem = [];
        await Promise.all(products.map(async (product) => {
            const findProductById = await productSchema.findOneAndUpdate({ _id: product._id, "product_attributes._id": product.attributes }, {
                $inc: {
                    "product_attributes.$.quantity": -product.quantity,
                    product_quantity: -product.quantity
                }
            }, {
                projection: { _id: 1, product_price: 1, product_shop: 1, 'product_attributes.$': 1 }
            }
            )
            if (!findProductById) {
                return { message: 'Không tìm thấy sản phẩm' }
            }

            const price = Number(findProductById.product_price) * Number(product.quantity)
            const attributes = {
                color: findProductById.product_attributes[0].color,
                size: product.size,
                quantity: product.quantity
            }
            const orderItem = await orderItemSchema.create({
                productId: findProductById._id,
                quantity: product.quantity,
                idShop: findProductById.product_shop,
                price,
                attributes
            })
            saveCreateOrderItem.push(orderItem)
        }))
        const orders = {};
        saveCreateOrderItem.forEach((orderItem) => {
            const { idShop } = orderItem;
            if (!orders[idShop]) {
                orders[idShop] = {
                    userId: userId,
                    totalValue: 0,
                    status: 'PENDING',
                    orderItem: [],
                };
            }
            orders[idShop].orderItem.push(orderItem._id);
            orders[idShop].totalValue += orderItem.price;
        });
        const createdOrders = [];
        await Promise.all(
            Object.values(orders).map(async (orderData) => {
                const createdOrder = await orderSchema.create(orderData);
                createdOrders.push(createdOrder);
            })
        );
        const getIdProductInCart = [];
        products.forEach((item) => {
            getIdProductInCart.push(item._id);
        })
        await cartSchema.findOneAndUpdate(
            { userId },
            {
                $pull: {
                    "products": {
                        "product_id": {
                            $in: getIdProductInCart,
                        }
                    },
                },
            }
        );
        socketManager.sendNewOrder('Bạn đã có 1 đơn hàng mới ');
        return {
            message: 'Đặt hàng thành công',
            createdOrders
        }
    }
    static payOneProduct = async ({ userId, products }) => {
        const findProduct = await productSchema.findOneAndUpdate({ _id: products._id, "product_attributes._id": products.attributes }
            , {
                $inc: {
                    "product_attributes.$.quantity": -products.quantity,
                    product_quantity: -products.quantity
                }
            }
            , {
                projection: { _id: 1, product_quantity: 1, product_price: 1, product_shop: 1, 'product_attributes.$': 1 }
            }
        )
        if (!findProduct) {
            return {
                message: 'Không tìm thấy sản phẩm'
            }
        }
        const price = Number(findProduct.product_price) * Number(products.quantity)
        const attributes = {
            color: findProduct.product_attributes[0].color,
            size: products.size,
            quantity: products.quantity
        }
        const orderItem = await orderItemSchema.create({
            productId: findProduct._id,
            quantity: products.quantity,
            idShop: findProduct.product_shop,
            price,
            attributes
        })
        if (!orderItem) {
            return {
                message: 'Đặt hàng thất bại'
            }
        }
        const order = await orderSchema.create({
            userId, totalValue: orderItem.price, status: 'PENDING', orderItem: orderItem._id
        })
        return {
            message: 'Đặt hàng thành công',
            order
        }
    }
    static changeStatus = async ({ order_id, status }) => {
        const order = await orderSchema.findOneAndUpdate({ _id: order_id }, {
            $set: { status: status }
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
    static getOrderById = async ({ userId }) => {
        const order = await orderSchema.find({ userId }).lean()
        if (!order) return { message: 'Không có đơn hàng nào' }
        return {
            message: 'Danh sách đơn hàng',
            order
        }
    }
    static getOrderByIdForShop = async ({ shopId }) => {
        const orderRes = {
            user: [],
        };
        const order = await orderSchema.find({ shopId: shopId }).populate('orderItem').lean()
        if (!order) return { message: 'Không có đơn hàng nào' }
        const userOrder = [];
        const productOrder = [];

        for (let index = 0; index < order.length; index++) {
            const element = order[index];
            const findUserOder = await findById(element.userId);
            const findProductOder = await productSchema.findById(element.orderItem[0].productId);
            productOrder.push(findProductOder);
            userOrder.push(findUserOder);
            orderRes.user.push(
            {
                oderId:element._id,
                status:element.status,
                user_name: findUserOder.user_name,
                address:findUserOder.information.address,
                phoneNumber:findUserOder.information.phoneNumber,
                product_name: findProductOder.product_name,
                product_thumb:findProductOder.product_thumb,
                product_attributes:element.orderItem[0].attributes,
                product_price:element.orderItem[0].price,
                crateDate:element.createdAt
                
            }
        )
        }
        return {
            orderRes
        }
    }
}

module.exports = OrderService;

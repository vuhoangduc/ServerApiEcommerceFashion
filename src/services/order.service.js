const cartSchema = require('../models/cart.model')
const orderItemSchema = require('../models/oderItem.model')
const orderSchema = require('../models/oder.model')
const productSchema = require('../models/product.model');

class OrderService {

    static payInCart = async ({ userId, products }) => {
        let saveCreateOrderItem = [];
        await Promise.all( products.map(async (product) => {
            const findProductById = await productSchema.findOneAndUpdate({ _id: product._id }, {
                $inc: {
                    product_quantity: -product.quantity
                }
            })
            if (findProductById) {
                const price = Number(findProductById.product_price) * Number(product.quantity)
                await orderItemSchema.create({
                    productId: findProductById._id,
                    quantity: product.quantity,
                    idShop: findProductById.product_shop,
                    price
                }).then((res) => {
                    saveCreateOrderItem.push(res)
                })
            }
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
        return {
            message: 'Đặt hàng thành công',
            createdOrders
        }
    }
    static payOneProduct = async ({ userId, products }) => {
        const findProduct = await productSchema.findOneAndUpdate({ _id: products._id }, {
            $inc: {
                product_quantity: -products.quantity
            }
        })
        if (!findProduct) {
            return {
                message: 'Không tìm thấy sản phẩm'
            }
        }
        const price = Number(findProduct.product_price) * Number(products.quantity)
        const orderItem = await orderItemSchema.create({
            productId: findProduct._id,
            quantity: products.quantity,
            idShop: findProduct.product_shop,
            price
        })
        if (!orderItem) {
            return {
                message: 'Đặt hàng thất bại'
            }
        }
        const order = await orderSchema.create({
            userId,totalValue: orderItem.price,status: 'PENDING',orderItem: orderItem._id
        })
        return {
            message: 'Đặt hàng thành công',
            order
        }
    }
    static changeStatus = async ({order_id, status}) => {
        const order = await orderSchema.findOneAndUpdate({ _id: order_id }, {
            $set: { status: status}
        },{new: true})
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
    static getOrderById = async ({userId}) => {
        const order = await orderSchema.find({ userId }).lean()
        if (!order) return { message: 'Không có đơn hàng nào' }
        return {
            message: 'Danh sách đơn hàng',
            order
        }
    }
}

module.exports = OrderService;

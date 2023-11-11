const cartSchema = require('../models/cart.model')
const orderItemSchema = require('../models/oderItem.model')
const orderSchema = require('../models/oder.model')
const productSchema = require('../models/product.model');

class OrderService {
    static payInCart = async ({ userId, product }) => {
        let saveCreateOrderItem = [];
        await Promise.all( product.map(async (product) => {
            const findProductById = await productSchema.findOne({ _id: product._id })
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
        product.forEach((item) => {
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


}

module.exports = OrderService;

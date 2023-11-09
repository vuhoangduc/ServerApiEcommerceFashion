const { SuccessResponse } = require("../core/success.response");
const orderService = require('../services/order.service')
class OrderController {
    payInCart = async (req, res, next) => {
        new SuccessResponse({
            metadata: await orderService.payInCart({
                userId:req.user.userId,
                ...req.body
            })
        }).send(res);
    }
}
module.exports = new OrderController
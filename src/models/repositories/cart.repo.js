
const { converToObjectIdMongodb } = require('../../util');
const cartModel = require('../cartV2.model');
const findCartId = async (cartId) =>{
    return await cartModel.findOne({_id:converToObjectIdMongodb(cartId),cart_state:'active'}).lean()
}

module.exports = {
    findCartId
}
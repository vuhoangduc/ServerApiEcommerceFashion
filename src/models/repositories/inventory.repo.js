
const { converToObjectIdMongodb } = require('../../util');
const inventorySchema = require('../inventory.model');
const {Types} = require('mongoose')
const insertInventory = async({
    productId,shopId,stock,location = 'unKnow',attributes
})=>{
    return await inventorySchema.create({
        inven_productId : productId,
        inven_stock : stock,
        inven_loaction : location,
        inven_shopId : shopId,
        inven_stock_attributes:attributes
    })
}
const reservationInventory = async ({ productId, quantity, cartId, color, size }) => {
    console.log(productId, quantity, cartId, color, size);

const query = {
    "inven_productId": converToObjectIdMongodb(productId),
    "inven_stock": { $gte: quantity },
    "inven_stock_attributes": { $exists: true, $ne: [] } // Kiểm tra xem inven_stock_attributes tồn tại và không rỗng
};

const updateSet = {
    $inc: {
    "inven_stock": -quantity,
    "inven_stock_attributes.$[attr].quantity": -quantity,
    "inven_stock_attributes.$[attr].options.$[opt].options_quantity": -quantity
    },
    $push: {
    "inven_reservations": {
        quantity,
        cartId,
        createOn: new Date(),
        color,
        size
    }
    }
};

const options = {
    arrayFilters: [
    { "attr.color": color, "attr.options.size": size },
    { "opt.size": size }
    ],
    upsert: true,
    new: true
};

return await inventorySchema.updateOne(query, updateSet, options);
};


module.exports = {
    insertInventory,
    reservationInventory
}
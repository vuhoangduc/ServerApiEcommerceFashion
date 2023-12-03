
const { converToObjectIdMongodb } = require('../../util');
const inventorySchema = require('../inventory.model');
const { BadRequestError, StatusCode } = require('../../core/error.response')
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

    // Kiểm tra số lượng tồn kho có đủ không
    const availableStock = await checkAvailableStock(productId, quantity,color,size);
    if (!availableStock) {
        return false;
    }

    // Số lượng tồn kho đủ, thực hiện cập nhật
    const query = {
        "inven_productId": converToObjectIdMongodb(productId),
        "inven_stock_attributes": {
            $elemMatch: {
                "color": color,
                "options": {
                    $elemMatch: {
                        "size": size
                    }
                }
            }
        }
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

// Hàm kiểm tra số lượng tồn kho
const checkAvailableStock = async (productId, quantity, color, size) => {
    const document = await inventorySchema.findOne({
        "inven_productId": converToObjectIdMongodb(productId),
        "inven_stock": { $gte: quantity },
        "inven_stock_attributes": {
            $elemMatch: {
                "color": color,
                "options": {
                    $elemMatch: {
                        "size": size,
                        "options_quantity": { $gte: 0 } // Bổ sung điều kiện này
                    }
                }
            }
        }
    });
    if (document === null) {
        return false;
    }
    return true;
};


module.exports = {
    insertInventory,
    reservationInventory
}
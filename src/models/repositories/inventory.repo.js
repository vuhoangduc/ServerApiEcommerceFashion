
const { converToObjectIdMongodb } = require('../../util');
const inventorySchema = require('../inventory.model');
const {Types} = require('mongoose')
const insertInventory = async({
    productId,shopId,stock,location = 'unKnow'
})=>{
    console.log({productId,shopId,stock});
    return await inventorySchema.create({
        inven_productId : productId,
        inven_stock : stock,
        inven_loaction : location,
        inven_shopId : shopId,
    })
}
const reservationInventory = async({productId,quantity,cartId}) =>{
    const query = {
        inven_productId:converToObjectIdMongodb(productId),
        inven_stock:{$gte:quantity}
    },updateSet ={
        $inc:{
            inven_stock: -quantity
        },
        $push:{
            inven_revervations:{
                quantity,
                cartId,
                createOn:new Date()
            }
        }
    },options = {upsert:true,new:true};
    return await inventorySchema.findOneAndUpdate(query,updateSet,options)
}
module.exports = {
    insertInventory,
    reservationInventory
}
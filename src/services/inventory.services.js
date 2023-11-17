
const inventorySchema = require('../models/inventory.model');
const { getProductById } = require('../models/repositories/product.repo');

class inventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = 'ha noi',
    }){
        const product = await getProductById(productId)
        if(!product) return{message:'The product not exists!'};
        const query = {inven_shopId:shopId,inven_productId:productId},
        updateSet= {
            $inc:{
                inven_stock:stock
            },
            $set:{
                inven_location:location
            }
        },options = {upsert:true,new:true}
        return await inventorySchema.findOneAndUpdate(query,updateSet,options)

    }
}
module.exports = inventoryService;
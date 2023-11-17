
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'inventories'
var inventorySchema = new Schema({
    inven_productId:{type:Schema.Types.ObjectId,ref:'Product'},
    inven_loaction:{type:String, default:'unKnow'},
    inven_stock:{type:Number,required:true},
    inven_shopId:{type:Schema.Types.ObjectId,ref:'StoreDetail'},
    inven_reservations:{type:Array,default:[]},
    /*
        cartId:,
        stock:1,
        createOn:
    */
    
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, inventorySchema);
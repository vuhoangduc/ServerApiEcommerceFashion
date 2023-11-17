
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'CartV2';
const COLLECTION_NAME = 'v2_carts'
var cartSchema = new Schema({
    cart_state:{
        type:String, required:true,
        enum:['active','completed','failed','pending'],
        default:'active'
    },
    cart_products:{type:Array, required:true,default:[]},
    /*
    [
        {
            productId,
            shopId,
            quantity,
            name,
            price
        }
    ]
    */
    cart_count_product:{type:Number,default:0},
    cart_userId:{type:Schema.Types.ObjectId, ref:'User'},
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
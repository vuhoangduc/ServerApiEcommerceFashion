
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts'
const cartItem ={
    product_id:{type:Schema.Types.ObjectId, ref:'Product'},
    quantity:{type:Number},
    color:String,
    size:String
}

var cartSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    products:[cartItem],
    totalPrice: {
        type: Number, // Thêm trường totalPrice
        default: 0,
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
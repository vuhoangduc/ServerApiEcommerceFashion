
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'carts'

var cartSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    productId:[{type:Schema.Types.ObjectId, ref:'Product'}],
    quantity:{type:Number}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, cartSchema);
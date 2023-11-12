
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'OderItem';
const COLLECTION_NAME = 'oderItems'

var oderItemSchema = new Schema({
    productId:{type:Schema.Types.ObjectId, ref:'Product'},
    quantity: { type: Number },
    idShop:{type:Schema.Types.ObjectId, ref:'Shop'},
    price:{type:Number},
    attributes: {
        color:String,
        size: String,
        quantity:Number
    }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, oderItemSchema);
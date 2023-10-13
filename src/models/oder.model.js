
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Oder';
const COLLECTION_NAME = 'oders'

var oderSchema = new Schema({
    userId:{type:Schema.Types.ObjectId, ref:'User'},
    totalValue:{type:Number},
    status:{type:String},
    orderItem:[{type:Schema.Types.ObjectId, ref:'OderItem'}]
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, oderSchema);
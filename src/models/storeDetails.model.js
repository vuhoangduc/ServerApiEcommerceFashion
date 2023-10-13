
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'StoreDetail';
const COLLECTION_NAME = 'storeDetails'

var storeDetailSchema = new Schema({
    nameShop: {
        type: String,
        unique: true,
    },
    phoneNumberShop: { type: Number, index: true, unique: true },
    avatarShop:{type:String},
    des:{type:String},
    emailShop:{type:String,unique: true,index:true},
    address:{type:String},
    follower:[{ type: Schema.Types.ObjectId, ref: 'User' }],
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, storeDetailSchema);
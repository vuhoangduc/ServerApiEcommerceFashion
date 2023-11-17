
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'OderV2';
const COLLECTION_NAME = 'v2oders'

var oderV2Schema = new Schema({
    order_userId:{type:Schema.Types.ObjectId, ref:'User'},
    order_checkout:{type:Object,default:{}},
    /*
        order_checkout = {
            totalPrice,
            totalApllyDiscount,
            feeShip
        }
    */
    order_shipping:{type:Object,default:{}},
    /*
        street,
        City,
        state,
        country
    */
    order_payment:{type:Object,default:{}},
    order_products:{type:Array, required:true},
    order_trackingNumber:{type:String,default:'#00000'},
    order_status:{type:String,enum:['pending','confirmed','shipped','cancelled','delivered'],default:'pending'},
    
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, oderV2Schema);
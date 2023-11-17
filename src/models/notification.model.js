const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Notification';
const COLLECTION_NAME = 'notifications'

// order-001 : order Sucsses
// order-002 : order Faield
// promotion-002 : new Promotion
// shop-001: new product by user following

const notificationSchema = new Schema({
    noti_type:{type:String,enum:['order-001','order-002','promotion-002','shop-001'],required:true},
    noti_senderId: {type:Number,required:true},
    noti_receiveId:{type:String,required:true},
    noti_content:{type:String,required:true},
    noti_options:{type:Object,default:{}},
},{
    timestamps:true,
    collection:COLLECTION_NAME
})

module.exports = mongoose.model(DOCUMENT_NAME,notificationSchema);
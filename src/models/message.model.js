const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Message';
const COLLECTION_NAME = 'messagers'

var messageSchema = new Schema({
    senderId:{type:Schema.Types.ObjectId,ref:'User'},
    text:String,
    image:String,

},{
    timestamps:true,
    collection:COLLECTION_NAME
})

module.exports = mongoose.model(DOCUMENT_NAME,messageSchema);
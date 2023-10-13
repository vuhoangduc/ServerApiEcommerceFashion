const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Conversation';
const COLLECTION_NAME = 'convarsations'


var conversationSchema = new Schema({
    members:[{type:Schema.Types.ObjectId,ref:'User'}],
    messagers:[{type:Schema.Types.ObjectId,ref:'Message'}]
},{
    timestamps:true,
    collection:COLLECTION_NAME
})


module.exports = mongoose.model(DOCUMENT_NAME,conversationSchema);

const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Conversation';
const COLLECTION_NAME = 'conversations'


var conversationSchema = new Schema({
    userId:{type:Schema.Types.ObjectId,ref:'User'},
    shopId:{type:Schema.Types.ObjectId,ref:'User'},
    messagers:[{type:Schema.Types.ObjectId,ref:'Message',default:[]}],
    isRead:{
        user:{
            id:{type:Schema.Types.ObjectId,ref:'User'},
            status:{type:Boolean,default:true},
            countNew:{type:Number,default:0},
        },
        shop:{
            id:{type:Schema.Types.ObjectId,ref:'User'},
            status:{type:Boolean,default:true},
            countNew:{type:Number,default:0},
        }
    },
},{
    timestamps:true,
    collection:COLLECTION_NAME
})


module.exports = mongoose.model(DOCUMENT_NAME,conversationSchema);

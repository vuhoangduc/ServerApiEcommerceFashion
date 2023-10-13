
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Information';
const COLLECTION_NAME = 'informations'

var informationSchema = new Schema({
    phoneNumber: { type: Number, index: true },
    address:{type:String},
    avatar:{type:String},
    fullName:{type:String},
    gender: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác'],
        default: 'Nam'
    },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, informationSchema);
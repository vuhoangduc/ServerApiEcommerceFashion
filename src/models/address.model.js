
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Address';
const COLLECTION_NAME = 'addresses'

var adđressSchema = new Schema({
    nameAddress: { type: String, required: true },
    customAddress: { type: String, required: true }

}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, adđressSchema);
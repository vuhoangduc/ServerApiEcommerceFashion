
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'categorys'

var categorySchema = new Schema({
    category_name:{type:String},
    category_thumb:{type:String}
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, categorySchema);
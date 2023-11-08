const mongoose = require('mongoose');
const { Schema } = mongoose;
const DOCUMENT_NAME ='Review'
const COLLECTION_NAME = 'reviews'
const reviewSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: String,
},{
    collection: COLLECTION_NAME,
    timestamps:true,
});

module.exports = mongoose.model(DOCUMENT_NAME, reviewSchema);
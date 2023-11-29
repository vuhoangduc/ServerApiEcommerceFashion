
const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users'

var userSchema = new Schema({
    user_name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    password: {
        type: String,
        unique: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },
    role: {
        type: String,
        enum: ['Admin', 'Shop', 'User'],
        default: 'User'

    },
    information: { type: Schema.Types.ObjectId, ref: 'Information' },
    disable: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);

const { Schema, default: mongoose } = require('mongoose');
const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts'

var discountSchema = new Schema({
    discount_name: {type:String, required:true},
    discount_des :{type:String,required:true},
    discount_code :{type:String,required:true},
    discount_type: {type:String, default:'fixed_amount'},
    discount_value:{type:Number,required:true},
    discount_start_date:{type:Date , required:true},
    discount_end_date:{type:Date, required:true},
    discount_max_uses: {type:Number,required:true}, // số lượng discount được áp dụng
    discount_uses_count: {type:Number, required:true},// số discount đã sử dụng
    discount_users_used: {type:Array,default:[]},// ai đã sử dụng
    discount_max_uses_per_user: {type:Number, required:true},// số lượng cho phép sử dụng tối đa,
    discount_min_order_value:{type:Number,required:true},
    discount_shopId:{type:Schema.Types.ObjectId, ref:'User'},
    discount_is_active:{type:Boolean,default:true},
    discount_applies_to:{type:String,required:true,enum:['all','specific']},
    discount_product_ids: {type:Array,default:[]},// số sản phẩm được áp dụng
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})
module.exports = mongoose.model(DOCUMENT_NAME, discountSchema);
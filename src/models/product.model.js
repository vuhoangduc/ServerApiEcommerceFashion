
const {model, Schema,default: mongoose} = require('mongoose');
const slugify = require('slugify')
const DOCUMENT_NAME ='Product'
const COLLECTION_NAME = 'products'

const product_attributes_schema ={
    color:String,
    size:[String],
    quantity:Number
}

const productSchema = new Schema({
    product_name:{type:String, required:true},
    product_thumb:[{type:String, required:true}],
    product_description:String,
    product_slug:String,
    product_price:{type:String,required:true},
    product_quantity:{type:String,required:true},
    product_shop:{type:Schema.Types.ObjectId, ref:'Shop'},
    category:{type:Schema.Types.ObjectId, ref:'Category'},
    product_attributes:[product_attributes_schema],
    product_ratingAverage:{
        type:Number,
        default:4.5,
        min:[1,'Rating must be above 1.0'],
        max:[5,'Rating must be above 5.0'],
        set:(val) =>Math.round(val *10) /10
    },
    product_variation:{type:Array, default:[]},
    isDraft:{type:Boolean,default:true,index:true,select:false},
    isPublished:{type:Boolean,default:false,index:true,select:false},
},{
    collection: COLLECTION_NAME,
    timestamps:true,
})
productSchema.pre('save',function(next){
    this.product_slug = slugify(this.product_name, {lower:true})
    next()
})

module.exports = mongoose.model(DOCUMENT_NAME, productSchema);



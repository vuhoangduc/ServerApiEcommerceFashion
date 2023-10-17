

const  productSchema = require('../../models/product.model');
const {Types}= require('mongoose');
const findAllDraftsForShop = async({query,limit,skip}) =>{
    return await queryProduct({query,limit,skip})
}
const findAllPublicForShop = async({query,limit,skip}) =>{
    return await queryProduct({query,limit,skip})
}

const publishProductByShop = async({product_shop, product_Id})=>{
    const foundShop = await productSchema.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_Id),
    })
    if (!foundShop) {
        return null
    }
    foundShop.isDraft = false
    foundShop.isPublished = true
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const unpublishProductByShop = async({product_shop, product_Id})=>{
    const foundShop = await productSchema.findOne({
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_Id),
    })
    if (!foundShop) {
        return null
    }
    foundShop.isDraft = true
    foundShop.isPublished = false
    const {modifiedCount} = await foundShop.updateOne(foundShop)

    return modifiedCount
}
const queryProduct = async({query,limit,skip}) =>{
    console.log(query);
    return await productSchema.find(query)
.populate('product_shop','name email -_id')
.sort({updateAt:-1})
.skip(skip)
.limit(limit)
.lean()
.exec()
}

module.exports ={
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublicForShop,
    unpublishProductByShop
}
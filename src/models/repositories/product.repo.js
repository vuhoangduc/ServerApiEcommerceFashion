

const  productSchema = require('../../models/product.model');
const {converToObjectIdMongodb} = require('../../util/index');
const {Types}= require('mongoose');
const findAllDraftsForShop = async({query,limit,skip}) =>{
    return await queryProduct({query,limit,skip})
}
const findAllPublicForShop = async({query,limit,skip}) =>{
    return await queryProduct({query,limit,skip})
}
// publish hien
const publishProductByShop = async({product_shop, product_Id})=>{
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
// upPublish an
const unpublishProductByShop = async({product_shop, product_Id})=>{
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
const getProductById = async (productId) =>{
    return await productSchema.findOne({_id:converToObjectIdMongodb(productId)}).lean()
}
const checkProductByServer = async (products) =>{
    return await Promise.all(products.map(async product =>{
        const foundProduct = await getProductById(product.productId);
        console.log(foundProduct);
        if(foundProduct){
            return{
                price:foundProduct.product_price,
                quantity:product.quantity,
                productId:product.productId,
                color:product.color,
                size:product.size
            }
        }
    }))
}
const updateProductSold = async ({productId,type,quantity}) =>{
    console.log({productId,type,quantity});
    switch (type) {
        case 'tang':
            const tang = await productSchema.updateOne(
                { _id: converToObjectIdMongodb(productId) },
                { $inc: { product_sold: +quantity } }
            );
            break;
        case 'giam':
            const giam = await productSchema.updateOne(
                { _id: converToObjectIdMongodb(productId) },
                { $inc: { product_sold: -quantity } }
            );
        break;
    }
}
const reservationQuantity = async ({productId,quantity,cartId,color,size})=>{
    const availableStock = await checkAvailableStock(productId,quantity,color,size);
    if(!availableStock) return false;
    const query = {
        "_id":converToObjectIdMongodb(productId),
        "product_attributes":{
            $elemMatch: {
                "color": color,
                "options": {
                    $elemMatch: {
                        "size": size
                    }
                }
            }
        }
    };
    const updateSet = {
        $inc: {
            "product_quantity": -quantity,
            "product_attributes.$[attr].quantity": -quantity,
            "product_attributes.$[attr].options.$[opt].options_quantity": -quantity
        }
    };
    const options = {
        arrayFilters: [
            { "attr.color": color, "attr.options.size": size },
            { "opt.size": size }
        ],
        upsert: true,
        new: true
    };
    return await productSchema.updateOne(query,updateSet,options);
}

const checkAvailableStock = async (productId,quantity,color,size) =>{
    const document = await productSchema.findOne({
        "_id":converToObjectIdMongodb(productId),
        "product_quantity":{$gte:quantity},
        "product_attributes":{
            $elemMatch: {
                "color": color,
                "options": {
                    $elemMatch: {
                        "size": size,
                        "options_quantity": { $gte: quantity } // Bổ sung điều kiện này
                    }
                }
            }
        }
    });
    if(document === null){
        return false;
    }
    return true;
}
module.exports ={
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublicForShop,
    unpublishProductByShop,
    getProductById,
    checkProductByServer,
    updateProductSold,
    reservationQuantity,
    checkAvailableStock
}

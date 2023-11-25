const storeDetailSchema = require('../storeDetails.model');
const findAllDiscountCodeUnSelect = async({
    limit=50 , page = 1, sort = 'ctime',
    filter,unSelect,model
})=>{
    const skip = (page -1) * limit;
    const sortBy = sort === 'ctime' ? {_id:-1}:{_id:id};
    const documets = await model.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .lean()
    const foundShop = await storeDetailSchema.findOne({discount_shopId:documets.discount_shopId});
    for (let i = 0; i < documets.length; i++) {
        documets[i].thumb=foundShop.avatarShop;
        
    }
    return documets;
}

const checkDiscountExists = async({model,filter})=>{
    return await model.findOne(filter).lean()
}

module.exports = {
    findAllDiscountCodeUnSelect,
    checkDiscountExists
}
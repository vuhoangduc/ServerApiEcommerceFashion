/*
    Discount Services
    1 - Generator Discount Code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [user]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [user]
*/
const discountModel = require("../models/discount.model")
const { findAllPublicForShop } = require("../models/repositories/product.repo")
const {
    converToObjectIdMongodb
} = require('../util/index')
const{
    findAllDiscountCodeUnSelect, checkDiscountExists
} = require('../models/repositories/discount.repo')
const { model } = require("mongoose")
class DiscountService {
    static async createDiscountCode(payload){
        const{
            code,start_date,end_date,is_active,value,users_used,
            shopId, min_order_value,product_ids,applies_to,name,des,
            type,max_value,max_order,max_uses, uses_count, max_uses_per_user

        } = payload
        console.log(payload);
        // if(new Date() < new Date(start_date) || new Date() > new Date(end_date)){
        //     return{
        //         message:'Mã giảm giá đã hết hạn!'
        //     }
        // }

        if(new Date(start_date) >= new Date(end_date)){
            return{
                message:'Thời gian bắt đầu phải kết thúc trước ngày kết thúc'
            }
        }
        // create index for discount code
        const foundDiscount = await discountModel.findOne({
            discount_code:code,
            discount_shopId:converToObjectIdMongodb(shopId)
        }).lean()
        if(foundDiscount && foundDiscount.discount_is_active == true){
            return{
                message:'Mã giảm giá đã tồn tại!'
            }
        }
        const newDiscount = await discountModel.create({
            discount_name:name,
            discount_des:des,
            discount_code:code,
            discount_value:value,
            discount_min_order_value:min_order_value || 0,
            discount_start_date:new Date(start_date),
            discount_end_date:new Date(end_date),
            discount_max_uses:max_uses,
            discount_uses_count:uses_count,
            discount_type:type,
            discount_users_used:users_used,
            discount_shopId:shopId,
            discount_max_uses_per_user:max_uses_per_user,
            discount_is_active:is_active,
            discount_applies_to:applies_to,
            discount_product_ids:applies_to === 'all'?[]:product_ids
        });
        return newDiscount
    }

    static async upadteDiscountCode(){

    }

    static async getAllDiscountCodeWithProduct({code,shopId,userId,limit,page}){
        const foundDiscount = await discountModel.findOne({
            discount_code:code,
            discount_shopId:converToObjectIdMongodb(shopId)
        }).lean()
        if(!foundDiscount || foundDiscount.discount_is_active == false){
            return{
                message:'Mã giảm giá không hoạt động!'
            }
        }
        const {discount_applies_to,discount_product_ids} = foundDiscount
        console.log(discount_product_ids);
        let products;
        if(discount_applies_to === 'all'){
            // get all product
            products = await findAllPublicForShop({
                query:{
                    product_shop:converToObjectIdMongodb(shopId),
                    isPublished:true,
                },
                limit:+limit,
            })
        }
        if(discount_applies_to === 'specific'){
            // get product ids
            products = await findAllPublicForShop({
                query:{
                    _id:{$in: discount_product_ids},
                    isPublished:true,
                },
                limit:+limit,
            })
        }
        return products;
    }

    static async getAllDiscountCodeByShop({
        limit=5,page=1,shopId
    }){
        const discounts = await findAllDiscountCodeUnSelect({
            limit:+limit,
            page:+page,
            filter:{
                discount_shopId:converToObjectIdMongodb(shopId),
                discount_is_active:true,
            },
            unSelect:['__v','discount_shopId'],
            model:discountModel
        })
        return discounts
    }
    static async getAllDiscountCodeOfShop({
        shopId
    }){
        const discounts = await findAllDiscountCodeUnSelect({
            filter:{
                discount_shopId:converToObjectIdMongodb(shopId),
                discount_is_active:true,
            },
            unSelect:['__v','discount_shopId'],
            model:discountModel
        })
        return discounts
    }

    static async getDiscountAmount({codeId,userId,shopId,products}){
        console.log({codeId,userId,shopId,products});
        const foundDiscount = await checkDiscountExists({
            model:discountModel,
            filter:{
                discount_code:codeId,
                discount_shopId:converToObjectIdMongodb(shopId),
            }
        })
        if(!foundDiscount) return {message:'mã giảm giá không hoạt động'};
        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_users_used,
            discount_type,
            discount_value,
            discount_start_date,
            discount_end_date,
            discount_max_uses_per_user
        } = foundDiscount;
        if(!discount_is_active) return{message:'Mã giảm giá đã hết hạn'};
        if(!discount_max_uses) return{message:'Mã giảm giá đã hết hoạt động'};
        // if(new Date() < new Date(discount_start_date) || new Date() > new Date(discount_end_date)){
        //     return{message:'Mã giảm giá đã hết hoạt động'};
        // }
        // check xem có set giá trị tối thiểu hay ko
        let totalOder = 0;
        if(discount_min_order_value>0){
            // get total
            totalOder = products.reduce((acc, product)=>{
                return acc + (product.quantity * product.price)
            },0)

            // if(totalOder < discount_min_order_value){
            //     return {message:`Mã giả giá yêu cầu giá trị đơn hàng tối thiểu là ${discount_min_order_value}`}
            // }
        }
        console.log(totalOder);
        if(discount_max_uses_per_user>0){
            const userUsesDiscount = discount_users_used.find(user => user.userId === userId);
            if(userUsesDiscount){

            }
        }
        const amount = discount_type === 'fixed_amount' ? discount_value : totalOder * (discount_value / 100);
        console.log(amount);
        return{
            totalOder,
            discount:amount,
            totalPrice: totalOder - amount
        }
    }

    static async deleteDiscountCode({shopId,codeId}){
        const deleted = await discountModel.findOneAndDelete({
            _id:codeId,
            discount_shopId: converToObjectIdMongodb(shopId),
        })
        return deleted
    }

    static async canelDiscountCode({codeId,shopId,userId}){
        const foundDiscount = await checkDiscountExists({
            model:discountModel,
            filter:{
                discount_code:codeId,
                discount_shopId:converToObjectIdMongodb(shopId)
            }
        })
        if(!foundDiscount) return {message:`discount doesn't exits`}

        const result = await discountModel.findByIdAndUpdate(foundDiscount._id,{
            $pull: {
                discount_user_used:userId,
            },
            $inc:{
                discount_max_uses:1,
                discount_uses_count:-1
            }
        })
        return result;
    }
}


module.exports = DiscountService

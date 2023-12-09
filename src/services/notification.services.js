const notificationModel = require("../models/notification.model");
const { converToObjectIdMongodb } = require("../util");
const initSocketManager = require('../util/socket_manager');
const pushNotiToSystem = async ({
    type = 'shop-001',
    receivedId = 1,
    senderId = 1,
    options={},
    note=''
}) =>{
    let noti_content;
    if(type === 'shop-001'){
        noti_content = 'Shop vừa mới thêm 1 sản phẩm'
    }else if(type === 'shop-002'){
        noti_content = 'Shop vừa mới thêm 1 giảm giá mới'
    }else if(type === 'order-001'){
        noti_content = 'Bạn có 1 đơn hàng mới!'
    }
    else if(type === 'order-002'){
        noti_content = 'Sản phẩm này của bạn đang trong tình trạng hết hàng'
    }
    else if(type === 'order-003'){
        noti_content = 'Có 1 đơn hàng của bạn đang được yêu cầu trả hàng với lý do '+note
    }
    const newNoti = await notificationModel.create({
        noti_type:type,
        noti_content,
        noti_receiveId:receivedId,
        noti_senderId:senderId,
        noti_options:options
    })
    initSocketManager.sendNotification({userId:senderId,message:noti_content});
    return newNoti;
}
const listNotiByUser = async ({
    userId=1,
    type = 'ALL',
    isRead=0
}) =>{
    const match = {noti_receiveId:userId}
    if(type !== 'ALL'){
        match['noti_type'] = type
    }

    return await notificationModel.aggregate([
        {
            $match: match
        },
        {
            $project:{
                noti_type:1,
                noti_senderId:1,
                noti_receiveId:1,
                noti_content:1,
                createdAt:1,
                noti_options:1
            }
        }
    ])
}
const listNotiByShop = async ({
    shopId,
    userId=2,
    type = 'ALL',
    isRead=0
}) =>{
    const match = {noti_receiveId:userId, noti_senderId:converToObjectIdMongodb(shopId)}
    if(type !== 'ALL'){
        match['noti_type'] = type
    }
    return await notificationModel.aggregate([
        {
            $match: match
        },
        {
            $project:{
                noti_type:1,
                noti_senderId:1,
                noti_receiveId:1,
                noti_content:1,
                createdAt:1,
                noti_options:1
            }
        }
    ])
}


module.exports = {
    pushNotiToSystem,
    listNotiByUser,
    listNotiByShop
}
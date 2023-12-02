const notificationModel = require("../models/notification.model");

const pushNotiToSystem = async ({
    type = 'shop-001',
    receivedId = 1,
    senderId = 1,
    options={}
}) =>{
    let noti_content;
    if(type === 'shop-001'){
        noti_content = 'Shop vừa mới thêm 1 sản phẩm'
    }else if(type === 'shop-002'){
        noti_content = 'Shop vừa mới thêm 1 giảm giá mới'
    }else if(type === 'order-001'){
        noti_content = 'Bạn có 1 đơn hàng mới!'
    }
    const newNoti = await notificationModel.create({
        noti_type:type,
        noti_content,
        noti_receiveId:receivedId,
        noti_senderId:senderId,
        noti_options:options
    })
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


module.exports = {
    pushNotiToSystem,
    listNotiByUser
}
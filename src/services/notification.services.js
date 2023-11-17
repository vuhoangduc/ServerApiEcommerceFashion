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


module.exports = {
    pushNotiToSystem
}

const conversationSchema = require('../models/conversation.model');
const messageSchema = require('../models/message.model');
const {findById,findByIdForShop} = require('../services/userSchema.services');
const { converToObjectIdMongodb } = require('../util');
class MessageService {

    static sendMessage = async ({ senderId, message, conversationId }) => {
            const foundChat = await conversationSchema.findOne({ _id: conversationId });
    
            if (!foundChat) {
                return { message: 'Có lỗi sảy ra' };
            }
            const messageChat = {
                senderId,
                text: message,
            };
            const newMessage = await messageSchema.create(messageChat);
            foundChat.messagers.push(newMessage._id);
            await foundChat.save();
            return newMessage;
    };

    static createConversation = async ({userId,shopId}) =>{
        const foundChat = await conversationSchema.findOne({
            userId,
            shopId
        })
        if(foundChat) return {
            message:'Đã có cuộc gọi',
            conversationId:foundChat._id
        };

        const newChat = await conversationSchema.create({
            userId,
            shopId
        })
        if(!newChat){
            return {message:'Có lỗi sảy ra!!'}
        }
        return {
            message:'Tạo thành công!!!'
        }
    }

    static getConversationForShop = async ({shopId}) =>{
        const chats = [
        ]
        const foundChat = await conversationSchema.find({shopId:shopId});
        if(!foundChat || foundChat.length < 0) return {message:'Bạn chưa có đoạn chat nào!!!'};
        const userOfChat = [];
        for (let i = 0; i < foundChat.length; i++) {
            const foundUser = await findById(converToObjectIdMongodb(foundChat[i].userId));
            chats.push({
                user:{
                    userId:foundUser._id,
                    user_name:foundUser.information.fullName,
                    user_avatar:foundUser.information.avatar,
                    user_status:foundUser.status
                },
                chat:foundChat[i]
            })
        }
        return chats;
    }

    static getMessages = async ({conversationId}) =>{
        const chats = [];
        const foundChat = await conversationSchema.findOne({ _id: conversationId }).populate('messagers');
        // const foundUser = await findById(converToObjectIdMongodb(conversationId.userId));
        // const foundShop = await findByIdForShop(converToObjectIdMongodb(conversationId.shopId));
        // chats.push({
        //     foundUser,
        //     foundShop,
        //     foundChat
        // })
        return foundChat;
    }
    static updateConversation = async({conversationId,isRead}) =>{
const foundChat = await conversationSchema.findOne({ _id: conversationId })
    }
    // static getMessager = async (data) => {
    //     const messager = await conversationSchema.
    //         findById({ _id: data }).
    //         populate('messagers', 'text senderId image createdAt').
    //         populate('members', 'user_name user_avatar ').
    //         lean();
    
    //     if (messager) {
    //         // Trích xuất thông tin thành viên
    //         const membersInfo = await Promise.all(messager.members.map(async member => {
    //             // Lấy thông tin người dùng bằng ID
    //             const user = await userSchema.findById(member._id).
    //                 populate('user_avatar', 'thumbNail').
    //                 lean();
    
    //             // Trả về thông tin của người dùng kèm hình ảnh
    //             return {
    //                 id: user._id,
    //                 thumbNail: user.user_avatar ? user.user_avatar.thumbNail : null,  // Lấy thông tin hình ảnh từ người dùng nếu có
    //                 createdAt: user.createdAt,
    //                 updatedAt: user.updatedAt,
    //                 __v: user.__v,
    //             };
    //         }));
    
    //         // Bổ sung thông tin thành viên vào object messager
    //         messager.members = membersInfo;
    
    //         return {
    //             message: 'Thành công !!!',
    //             status: 200,
    //             messager
    //         }
    //     }
    // }


    // static getConvarsations = async (userId) => {
    //     const user = await userSchema.findById(userId).populate("convarsations");
    //     if (user) {
    //         const conversationIds = user.convarsations.map(conversation => conversation._id);

    //         // Tìm các cuộc trò chuyện dựa trên danh sách conversationIds
    //         const conversations = await conversationSchema.find({ _id: { $in: conversationIds } });

    //         // Tạo một mảng để chứa thông tin tên và avatar của các thành viên (trừ userId)
    //         const members = [];

    //         for (const conversation of conversations) {
    //             // Lọc ra các thành viên khác userId từ mảng members trong conversation
    //             const otherMembers = conversation.members.filter(member => member != userId);

    //             // Lặp qua các thành viên còn lại
    //             for (const memberId of otherMembers) {
    //                 // Tìm thông tin của thành viên từ userSchema
    //                 const member = await userSchema.findById(memberId).
    //                     populate('user_avatar', 'thumbNail');

    //                 if (member) {
    //                     // Lấy tên và avatar của thành viên
    //                     const memberInfo = {
    //                         userId: member._id,
    //                         conversationId: conversation._id,
    //                         name: member.user_name,
    //                         avatar: member.user_avatar.thumbNail,
    //                         status: member.status
    //                     };

    //                     // Thêm thông tin vào mảng members
    //                     members.push(memberInfo);
    //                 } else {
    //                     console.log(`User with ID ${memberId} not found`);
    //                 }
    //             }
    //         }

    //         if (members) return {
    //             message: 'Thành công !!!',
    //             status: 200,
    //             metadata: members
    //         }

    //     } else {
    //         // Xử lý trường hợp không tìm thấy người dùng
    //         console.log(`User with ID ${userId} not found`);
    //     }
    // }

}

module.exports = MessageService
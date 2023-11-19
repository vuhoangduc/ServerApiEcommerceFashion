const { SuccessResponse } = require('../core/success.response');
const MessageService = require('../services/message.services');
class MessageController {
    sendMessage = async (req,res,next) =>{
        new SuccessResponse({
            metadata: await MessageService.sendMessage({
                senderId:req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    createConversation = async (req,res,next) =>{
        new SuccessResponse({
            metadata: await MessageService.createConversation({
                userId:req.user.userId,
                ...req.body
            })
        }).send(res)
    }
    getConvarsationsForShop = async (req,res,next) =>{
        new SuccessResponse({
            metadata: await MessageService.getConversationForShop({
                shopId:req.user.userId
            })
        }).send(res)
    }
    getMessagers = async (req,res,next) =>{
        new SuccessResponse({
            metadata: await MessageService.getMessages({
                conversationId:req.params.id
            })
        }).send(res)
    }

    // getConvarsations = async (req,res,next) =>{
    //     new SuccessResponse({
    //         metadata: await MessageService.getConvarsations(req.user.userId)
    //     }).send(res)
    // }

}
module.exports = new MessageController;
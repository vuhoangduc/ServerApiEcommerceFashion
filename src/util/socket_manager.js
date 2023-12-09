let io;
const cors = require('cors');
const { updateUser,updateStatus} = require('../services/userSchema.services');
const MessageService = require('../services/message.services');

const initSocketManager = (server) => {
    let onlineUsers = [];
    io = require("socket.io")(server, {
        cors: {
            origin: [
                "http://localhost:3000",
                "http://127.0.0.1:5501",
            ],
            methods: ["GET", "POST"],
        },
        maxHttpBufferSize: 1e8,
    });

    io.on('connection', (socket) => {
        console.log(`⚡🖕🏿: ${socket.id} user just connected`);
        socket.on('joinRoom', (roomName) => {
            socket.join(roomName);
            console.log(`User ${socket.id} joined room: ${roomName}`);
            socket.on('chat message', async ({ senderId, message, conversationId }) => {
                if (typeof senderId !== 'string' || typeof message !== 'string' || typeof conversationId !== 'string') {
                    // Xử lý lỗi hoặc gửi thông báo lỗi cho client
                    return;
                }
                const result = await MessageService.sendMessage({senderId:senderId, message:message, conversationId:conversationId});
                io.to(roomName).emit('send message',{
                    _id:result._id,
                    senderId:result.senderId,
                    text:result.text,
                    createdAt:result.createdAt,
                    updatedAt:result.updatedAt
                });
            });
        });
        socket.on('leaveRoom', ({roomName,userId}) => {
            socket.leave(roomName);
            console.log(`User ${socket.id} left room: ${roomName}`);
            
            // Xóa tất cả các lắng nghe 'chat message' khi rời phòng
            socket.removeAllListeners('chat message');
        });

        socket.on("new-user-add", async (newUserId) => {
            console.log(onlineUsers);
            console.log('user has id::' + newUserId + ' login ');
            if (!onlineUsers.some((user) => user.userId === newUserId)) {  // if user is not added before
                onlineUsers.push({ userId: newUserId, socketId: socket.id });
                console.log(onlineUsers);
                const user = await updateStatus(newUserId);
                if (user) {
                    const metadata = {
                        userId: user._id,
                        status: user.status
                    }
                    setTimeout(() => {
                        io.emit('update-status', metadata)
                    }, 2000)
                }
            }
        });
        socket.on("logout", async () => {
            try {
                console.log(onlineUsers);
                const userDis = onlineUsers.find((user) => user.socketId === socket.id);
                onlineUsers = onlineUsers.filter((user) => user.socketId != socket.id)
                if (userDis) {
                    console.log("User disconnected", userDis.userId);
                    // Update user status to "inactive"
                    const updatedUser = await updateStatus(userDis.userId);
                    if (updatedUser) {
                        const metadata = {
                            userId: updatedUser._id,
                            status: updatedUser.status
                        }
                        console.log("User status updated:");
                        setTimeout(() => {
                            io.emit('update-status', metadata)
                        }, 2000)
                    } else {
                        console.log("User not found or status update failed");
                    }
                } else {
                    console.log("Disconnected user not found in onlineUsers");
                }
            } catch (error) {
                console.error("Error handling user disconnect:", error);
            }
        });
        socket.on("disconnect", async () => {
            try {
                console.log(onlineUsers);
                const userDis = onlineUsers.find((user) => user.socketId === socket.id);
                onlineUsers = onlineUsers.filter((user) => user.socketId != socket.id)
                if (userDis) {
                    console.log("User disconnected", userDis.userId);
                    // Update user status to "inactive"
                    const updatedUser = await updateStatus(userDis.userId);
                    if (updatedUser) {
                        const metadata = {
                            userId: updatedUser._id,
                            status: updatedUser.status
                        }
                        console.log("User status updated:");
                        setTimeout(() => {
                            io.emit('update-status', metadata)
                        }, 2000)
                    } else {
                        console.log("User not found or status update failed");
                    }
                } else {
                    console.log("Disconnected user not found in onlineUsers");
                }
            } catch (error) {
                console.error("Error handling user disconnect:", error);
            }
        });
        // Thêm các chức năng Socket.IO khác tại đây
    });
};
const sendNotification = (metaData) => {
    io.emit(`notification-${metaData.userId}`,metaData.message);
};
const newChat = (senderUser) => {
    console.log(senderUser.userId);
    io.emit(`newChat-${senderUser.userId}`);
}
const sendNewOrder = (message) => {
    console.log(message);
    io.emit('newOrder', { message });
};
module.exports = {
    initSocketManager,
    sendNotification,
    sendNewOrder,
    newChat
};

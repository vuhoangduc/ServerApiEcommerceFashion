let io;
const cors = require('cors');
const initSocketManager = (server) => {
    io = require("socket.io")(server, {
        cors: {
            origin: [
                "http://localhost:3000",
                "http://127.0.0.1:5500"
            ],
            methods: ["GET", "POST"],
        },
        maxHttpBufferSize: 1e8,
    });

    io.on('connection', (socket) => {
        console.log(`⚡: ${socket.id} user just connected`);
        socket.on('disconnect', () => {
            console.log('A user disconnected');
        });

        // Thêm các chức năng Socket.IO khác tại đây
    });
};

const sendNotification = (message) => {
    io.emit('notification', { message });
};

module.exports = {
    initSocketManager,
    sendNotification,
};

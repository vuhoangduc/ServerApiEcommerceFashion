const app = require('./src/app');
const PORT = process.env.PORT || 8080;
const http = require('http');
const server = http.createServer(app);
// var io = require("socket.io")(server, {
//     maxHttpBufferSize: 1e8,
// });
// var check = false;
const socketManager = require('./src/util/socket_manager');
socketManager.initSocketManager(server);

server.listen(PORT, () => {
    console.log(`WSV eComerece start with ${PORT}`);
});

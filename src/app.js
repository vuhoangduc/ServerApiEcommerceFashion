const express = require('express');
const app = express();
const morgan = require('morgan');
const { default: helmet } = require('helmet');
const compression = require('compression');
const upload = require('./util/upload_file');
require('dotenv').config();
// init midleware
app.use(morgan("dev"));
app.use(helmet());
app.use(
    express.urlencoded({
        extended: true
    }),
)
app.use(compression(),
    express.json());
// init db

require('./db/init.mongodb');
// init routes
const cors = require('cors');
const corsOptions = {
    origin: 'http://localhost:3000',
    origin: 'http://127.0.0.1:5501',
    origin: 'http://127.0.0.1:5501/thi_thu/bai1/index.html',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));
// app.use(function (req, res, next) {
//     // Đặt các tiêu đề CORS thích hợp
//     res.header("Access-Control-Allow-Origin", "http://localhost:3001");
//     res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,PATCH");
//     res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Accept");
//     res.header("Access-Control-Allow-Credentials", true); // Nếu bạn sử dụng cookie
//     // Thêm tiêu đề Cross-Origin-Resource-Policy để cho phép tài nguyên từ nguồn khác
//     res.header("Cross-Origin-Resource-Policy", "cross-origin");
//     // Tiếp tục xử lý các yêu cầu OPTIONS tiếp theo
//     if (req.method === 'OPTIONS') {
//     res.status(200).end();
//     } else {
//       // Tiếp tục xử lý các yêu cầu tiếp theo không phải OPTIONS
//     next();
//     }
// });
app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});
app.use('/uploads', express.static('uploads'));
app.post('/uploadVideo',upload.single('avatar'));
app.use('', require('./routes/index'));
app.get('/',(req,res,next)=>{
res.send('Hello World!!!');
})
// handling error
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
app.use((error, req, res, next) => {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        stack: error.stack,
        message: error.message || 'Internal Server Error'
    })
})
module.exports = app;
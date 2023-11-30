const { reservationInventory } = require('../models/repositories/inventory.repo');
const { promisify } = require('util');
// const redisClient = require('../db/init.redis');
// const redis = require('redis');
// const { set, model } = require('mongoose');
// const client = redis.createClient({
//     host: '127.0.0.1', // your Redis server host
//     port: 6379,         // your Redis server port
//     // password: 'your_password', // uncomment and set if you have a password
// });


// const setExAsync = promisify(client.setEx).bind(client);
// const pexpireAsync = promisify(client.pExpire).bind(client);
// const delAsync = promisify(client.del).bind(client);

const acquirelock = async (productId, quantity,cartId,color,size) => {
    const isReservation = await reservationInventory({
        productId,
        quantity,
        cartId,
        color,
        size
    });
    return true;
    // const key = `lock_v2023_${productId}`;
    // const retryTimes = 10;
    // const expireTime = 3000;
    // for (let i = 0; i < retryTimes; i++) {
    //     try {
    //         const result = await setExAsync(key, expireTime, '1');
    //         console.log('result:::' + result);
    //         if (result === 'OK') {
    //             const isReservation = await reservationInventory({
    //                 productId,
    //                 quantity,
    //                 cartId
    //             });
    //             // Kiểm tra xem có thuộc tính modifiedCount không
    //             if (isReservation && isReservation.modifiedCount) {
    //                 await pexpireAsync(key, expireTime);
    //                 return key;
    //             }
    //             return null;
    //         } else {
    //             await new Promise((resolve) => setTimeout(resolve, 50));
    //         }
    //     } catch (error) {
    //         console.error('Error acquiring lock:', error);
    //         // Xử lý lỗi và thử lại nếu cần thiết
    //     }
    // }
};

// const releaselock = async keyLock => {
//     // try {
//     //     // Kiểm tra xem keyLock có tồn tại không trước khi xóa
//     //     const exists = await setExAsync(keyLock, 0, '0');
//     //     if (exists === 'OK') {
//     //         await delAsync(keyLock);
//     //     }
//     // } catch (error) {
//     //     console.error('Error releasing lock:', error);
//     //     // Xử lý lỗi nếu cần thiết
//     // }
// };

module.exports = {
    acquirelock
};

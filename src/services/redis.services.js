const { resolve } = require('path');
const redis = require('redis');
const util = require("util");
const { reservationInventory } = require('../models/repositories/inventory.repo');
const redisClient = redis.createClient();

// Đảm bảo phương thức tồn tại và làm đúng cú pháp
if (typeof redisClient.expire !== 'function') {
    throw new Error('expire method not found in redisClient');
}
const expireAsync = (key, seconds) => {
    return new Promise((resolve, reject) => {
        redisClient.expire(key, seconds, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
const setnxAsync = (key, seconds) => {
    return new Promise((resolve, reject) => {
        redisClient.setnx(key, seconds, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};


const acquirelock = async (productId, quantity, cartId) => {
    const key = `lock_v2023_${productId}`;
    const retryTimes = 10;
    const expireTime = 3; // Đổi expireTime thành giây

    for (let i = 0; i < retryTimes; i++) {
        const result = await setnxAsync(key, expireTime);
        console.log(`result:::`, result);

        if (result === 1) {
            const isReservation = await reservationInventory({
                productId, quantity, cartId
            });

            if (isReservation.modifiedCount) {
                await expireAsync(key, expireTime);
                return key;
            }
            return null;
        } else {
            await new Promise((resolve) => setTimeout(resolve, 50));
        }
    }
}

const releaselock = async keyLock => {
    const delAsyncKey = (key, seconds) => {
        return new Promise((resolve, reject) => {
            redisClient.del(key, seconds, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
    return await delAsyncKey(keyLock);
}

module.exports = {
    acquirelock,
    releaselock
}

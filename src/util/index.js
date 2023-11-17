
const {Types} = require('mongoose');
const converToObjectIdMongodb = id => new Types.ObjectId(id)


module.exports = {
    converToObjectIdMongodb
}
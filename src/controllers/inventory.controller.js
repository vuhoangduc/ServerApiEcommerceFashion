

const {SuccessResponse} = require('../core/success.response');
const { model } = require('mongoose');
const inventoryService = require('../services/inventory.services');

class inventoryController{

    addStockToInventory = async (req,res,next)=>{
        new SuccessResponse({
            message:'Create new Cart success',
            metadata: await inventoryService.addStockToInventory(req.body)
        }).send(res)
    }
}

module.exports = new inventoryController()
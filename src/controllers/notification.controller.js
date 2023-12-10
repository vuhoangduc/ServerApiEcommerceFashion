const { SuccessResponse } = require("../core/success.response");
const MessageService = require("../services/message.services");
const {
  listNotiByUser,
  listNotiByShop,
} = require("../services/notification.services");

class NotificationController {
  listNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "",
      metadata: await listNotiByUser(req.query),
    }).send(res);
  };
  listNotiByShop = async (req, res, next) => {
    new SuccessResponse({
      message: "",
      metadata: await listNotiByShop({
        query: req.query,
        shopId: req.user.userId,
      }),
    }).send(res);
  };
}
module.exports = new NotificationController();

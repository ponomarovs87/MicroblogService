const apiError = require("../exceptions/api-errors");

module.exports = function (err, req, res, next) {
  console.log(err); // todo убрать перед диплоем
  if (err instanceof apiError) {
    return res
      .status(err.status)
      .json({
        message: err.message,
        errors: err.errors,
        reqData: err.reqData,
      });
  }
  return res
    .status(500)
    .json({ message: `непредвиденная ошибка` });
};

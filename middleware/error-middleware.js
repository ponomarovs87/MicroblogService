const ApiError = require("../exceptions/api-errors");

module.exports = function (err, _req, res, _next) {
  console.log(err); // todo убрать перед диплоем
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors,
      reqData: err.reqData,
    });
  }
  return res
    .status(500)
    .json({ message: `непредвиденная ошибка` });
};

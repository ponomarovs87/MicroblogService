const ClientError = require("../exceptions/client-errors");

module.exports = function (err, req, res, next) {
  console.log("ClientError", err); // todo убрать перед диплоем

  if (err instanceof ClientError) {
    return res.status(err.status).render(err.renderPage, {
      message: err.message,
      errors: err.errors,
      formData: err.reqData,
    });
  }

  // Для всех других типов ошибок
  return res.status(500).render("pages/error", {
    message: "Непредвиденная ошибка",
    err,
  });
};

module.exports = class ApiError extends Error {
  status;
  errors;
  reqData;

  constructor(status, message, errors = [], reqData) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.reqData = reqData;
  }

  static ValidationError(errors, reqData) {
    return new ApiError(
      400,
      "Ошибка валидации",
      errors,
      reqData
    );
  }

  static UnauthorizedError() {
    return new ApiError(401, `Пользователь не авторизован`);
  }
  static BadRequest(message, errors = [], reqData) {
    return new ApiError(400, message, errors, reqData);
  }
};

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

  static UnauthorizedError(
    message = `Пользователь не авторизован`
  ) {
    return new ApiError(401, message);
  }
  static BadRequest(message, errors = [], reqData) {
    return new ApiError(400, message, errors, reqData);
  }
  static NotFound(message, errors = []) {
    return new ApiError(404, message, errors);
  }
  static Forbidden(message = `У вас нет доступа`) {
    return new ApiError(403, message);
  }
};

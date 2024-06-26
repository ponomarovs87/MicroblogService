class ClientError extends Error {
  constructor(
    status,
    message,
    errors = [],
    reqData,
    renderPage = "pages/error"
  ) {
    super(message);
    this.status = status;
    this.errors = errors;
    this.reqData = reqData;
    this.renderPage = renderPage;
  }

  static ValidationError({ errors, reqData, renderPage }) {
    return new ClientError(
      400,
      "Ошибка валидации",
      errors,
      reqData,
      renderPage
    );
  }

  static BadRequest({
    message,
    errors = [],
    reqData,
    renderPage,
  }) {
    return new ClientError(
      400,
      message,
      errors,
      reqData,
      renderPage
    );
  }

  static Forbidden({
    message = "У вас нет доступа",
    renderPage = "pages/error",
  }) {
    console.log(message,renderPage);
    return new ClientError(
      403,
      message,
      null,
      null,
      renderPage
    );
  }

  static UnauthorizedError({
    message = "Пользователь не авторизован",
    renderPage = "pages/error",
  }) {
    return new ClientError(
      401,
      message,
      null,
      null,
      renderPage
    );
  }

  static NotFound({
    message = "Страница не найдена",
    errors = [],
    renderPage = "pages/error",
  }) {
    return new ClientError(
      404,
      message,
      errors,
      null,
      renderPage
    );
  }
}

module.exports = ClientError;

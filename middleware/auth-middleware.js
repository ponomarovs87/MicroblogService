const apiError = require("../exceptions/api-errors");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(apiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(apiError.UnauthorizedError());
    }
    const userData =
      tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(apiError.UnauthorizedError());
    }
    //todo можно добавить проверку тот ли это юзер
    req.user = userData;
    next();
  } catch (err) {
    next(apiError.UnauthorizedError());
  }
};

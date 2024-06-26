const ClientError = require("../exceptions/client-errors");
const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    if (!req.cookies) {
      return next(ClientError.Forbidden({}))
    }

    const {accessToken} = req.cookies
    if (!accessToken) {
      return next(ClientError.Forbidden({}))
    }

    const userData =
      tokenService.validateAccessToken(accessToken);

    if (!userData) {
      return next(ClientError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (err) {
    next(ClientError.UnauthorizedError());
  }
};

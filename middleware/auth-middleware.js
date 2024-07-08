require("dotenv").config();
const config = require("config");

const ApiError = require("../exceptions/api-errors");
const tokenService = require("../service/token-service");
const userService = require("../service/user-service");
const clearCookieRefreshToken = require("../helper/clearCookieRefreshToken");

module.exports = function (checkAdmin = false) {
  return async function (req, res, next) {
    try {
      const authorizationHeader = req.headers.authorization;
      if (!authorizationHeader) {
        return next(ApiError.UnauthorizedError());
      }

      const accessToken = authorizationHeader.split(" ")[1];
      if (!accessToken) {
        return next(ApiError.UnauthorizedError());
      }

      const userData =
        tokenService.validateAccessToken(accessToken);
      if (!userData) {
        return next(ApiError.UnauthorizedError());
      }

      await userService.existingUser(userData.email);

      const existingUser = await userService.existingUser(
        userData.email
      );
      const role = await userService.checkRole(userData.id);

      if (
        !existingUser ||
        (checkAdmin && role !== config.role.adminRole)
      ) {
        clearCookieRefreshToken(res);
        return next(ApiError.Forbidden());
      }

      req.user = userData;
      next();
    } catch (err) {
      next(ApiError.UnauthorizedError());
    }
  };
};

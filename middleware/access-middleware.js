require("dotenv").config();
const config = require("config");

const tokenService = require("../service/token-service");
const userService = require("../service/user-service");

module.exports = function (checkAdmin = false) {
  return async function (req, res, next) {
    const { refreshToken } = req.cookies;
    try {
      const token =
        tokenService.validateRefreshToken(refreshToken);
      if (refreshToken && token) {
        if (checkAdmin) {
          const userData = await userService.existingUser(
            token.email,
            true
          );
          if (userData.role === config.role.adminRole) {
            return next();
          }
          return res.render("pages/auth/login/index", {
            errorMessage: "Нет доступа",
          });
        }
        return next();
      }

      return res.render("pages/auth/login/index", {
        errorMessage: "Вы давно не с нами, войдите еще раз",
      });
    } catch (err) {
      console.error("Token validation error:", err);
      return res.redirect("/");
    }
  };
};

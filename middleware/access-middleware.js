const tokenService = require("../service/token-service");

module.exports = function (req, res, next) {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const token =
        tokenService.validateRefreshToken(refreshToken);
      if (token) {
        return next();
      }
    }
    return res.render("pages/auth/login/index", {
      errorMessage: "Вы давно не с нами войдите еще раз",
    });
  } catch (err) {
    return res.redirect("/");
  }
};

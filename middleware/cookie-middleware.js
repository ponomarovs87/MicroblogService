require("dotenv").config();
const config = require("config");

function refreshCookieSave(res,refreshToken) {
  return res.cookie("refreshToken", refreshToken, {
    maxAge: config.cookie.refreshTokenMaxAge,
    httpOnly: true,
    secure: true,
  });
}

function accessCookieSave(res,accessToken) {
  return res.cookie("accessToken", accessToken, {
    maxAge: config.cookie.accessTokenMaxAge,
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
}

module.exports = { refreshCookieSave, accessCookieSave };

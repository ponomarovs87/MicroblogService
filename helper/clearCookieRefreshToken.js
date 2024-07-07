module.exports = function (res) {
  return res.clearCookie("refreshToken", { path: "/" });
};

const express = require("express");
const tokenService = require("../../service/token-service");
const accessMiddleware = require("../../middleware/access-middleware");
const userRouter = express.Router();

userRouter.get("/registration", (_req, res) => {
  try {
    return res.render("pages/auth/registration/index");
  } catch (err) {
    next(err);
  }
});

userRouter.get("/login", (_req, res) => {
  try {
    return res.render("pages/auth/login/index");
  } catch (err) {
    next(err);
  }
});

userRouter.get(
  "/myAccount",
  accessMiddleware,
  (req, res) => {
    try {
      return res.render("pages/auth/myAccount/index", {
        refreshToken: req.cookies.refreshToken,
      });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = userRouter;

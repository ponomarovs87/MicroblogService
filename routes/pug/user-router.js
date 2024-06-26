require("dotenv").config();
const config = require("config");

const { default: axios } = require("axios");
const express = require("express");
const userRouter = express.Router();

const formDataParser = express.urlencoded({
  extended: false,
});

const userValidation = require("../../validation/user-validation");
const userController = require("../../controller/user-controller");
const authMiddleware = require("../../middleware/auth-middleware");

userRouter.get("/registration", (_req, res) => {
  try {
    res.render("pages/auth/registration/index");
  } catch (err) {
    next(err);
  }
});

// userRouter.post(
//   "/registration",
//   formDataParser,
//   userValidation.userCreateValidator,
//   userController.registration
// );

// userRouter.get("/login", (_req, res) => {
//   try {
//     res.render("pages/auth/login/index");
//   } catch (err) {
//     next(err);
//   }
// });

// userRouter.post(
//   "/login",
//   formDataParser,
//   userController.login
// );

// userRouter.get("/logout", userController.logout);

// userRouter.get("/myAccount", authMiddleware, (req, res) => {
//   try {
//     const { accessToken } = req.cookies;
//     res.render("pages/auth/myAccount/index", {
//       accessToken,
//     });
//   } catch (err) {
//     next(err);
//   }
// });

// userRouter.post(
//   "/edit",
//   formDataParser,
//   authMiddleware,
//   userValidation.accessValidation,
//   userValidation.userEditValidator,
//   userController.edit
// );

// userRouter.post(
//   "/remove",
//   formDataParser,
//   authMiddleware,
//   userValidation.accessValidation,
//   userController.remove
// );

module.exports = userRouter;
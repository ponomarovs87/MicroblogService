const express = require("express");
const userRouterApi = express.Router();

const userController = require("../../controller/user-controller");
const userValidation = require("../../validation/user-validation");

userRouterApi.post(
  "/registration",
  userValidation.userCreateValidator,
  userController.registration
);
userRouterApi.get("/login", userController.login);
userRouterApi.get("/logout", userController.logout);
userRouterApi.put(
  "/edit",
  userValidation.accessValidation,
  userValidation.userEditValidator,
  userController.edit
);
userRouterApi.delete(
  "/delete",
  userValidation.accessValidation,
  userController.delete
);
userRouterApi.post("/refresh", userController.refresh);

module.exports = userRouterApi;

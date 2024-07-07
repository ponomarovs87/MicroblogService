const express = require("express");
const userRouterApi = express.Router();

const userController = require("../../controller/user-controller");
const userValidation = require("../../validation/user-validation");

userRouterApi.post(
  "/registration",
  userValidation.userCreateValidator,
  userController.registration
);
userRouterApi.post("/login", userController.login);
userRouterApi.get("/logout", userController.logout);
userRouterApi.post("/refresh", userController.refresh);

userRouterApi.use(userValidation.accessValidation);

userRouterApi.put(
  "/edit",
  userValidation.userEditValidator,
  userController.edit
);
userRouterApi.delete("/delete", userController.delete);

module.exports = userRouterApi;

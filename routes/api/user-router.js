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

userRouterApi.put(
  "/edit",
  userValidation.accessValidation, //todo переделать сейчас работает но это кошмар
  userValidation.userEditValidator,
  userController.edit
); // todo доделать токен в кеш или хрен с ним пускай перезаходят как изменили данные
userRouterApi.delete(
  "/delete",
  userValidation.accessValidation,
  userController.remove
);
userRouterApi.post("/refresh", userController.refresh);

module.exports = userRouterApi;

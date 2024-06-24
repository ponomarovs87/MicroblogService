const express = require("express");
const userRouterApi = express.Router();

const UserController = require("../../controller/user-controller");
const UserValidation = require("../../validation/user-validation");

userRouterApi.post(
  "/registration",
  UserValidation.userCreateValidator,
  UserController.registration
);

userRouterApi.get("/login", UserController.login);
userRouterApi.get("/logout", UserController.logout);

userRouterApi.put(
  "/edit",
  UserValidation.accessValidation, //todo переделать сейчас работает но это кошмар
  UserValidation.userEditValidator,
  UserController.edit
); // todo доделать токен в кеш или хрен с ним пускай перезаходят как изменили данные
userRouterApi.delete(
  "/delete",
  UserValidation.accessValidation,
  UserController.delete
);
userRouterApi.post("/refresh", UserController.refresh);

module.exports = userRouterApi;

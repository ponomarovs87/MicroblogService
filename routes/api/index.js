const express = require("express");
const routesApi = express.Router();

const userController = require("../../controller/user-controller");
const userValidation = require("../../validation/user-validation");

routesApi.post(
  "/registration",
  userValidation.userCreateValidator,
  userController.registration
);
routesApi.post("/login", userController.login);
routesApi.get("/logout", userController.logout);
routesApi.post(
  "/edit",
  userValidation.userEditValidator,
  userValidation.accessValidation,
  userController.edit
);
routesApi.delete("/delete", userController.delete);
routesApi.post("/refresh", userController.refresh);

module.exports = routesApi;

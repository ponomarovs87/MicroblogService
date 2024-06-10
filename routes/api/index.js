const express = require("express");
const routesApi = express.Router();

const userController = require("../../controller/user-controller");

routesApi.post(
    "/registration",
    // validation.registration, // todo validation
    userController.registration
  );
routesApi.post("/login",userController.login)
routesApi.get("/logout",userController.logout)
routesApi.put("/edit",userController.edit)
routesApi.delete("/delete",userController.delete)
routesApi.post("/refresh",userController.refresh)

module.exports = routesApi
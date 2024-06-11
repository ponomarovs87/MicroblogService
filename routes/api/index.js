const express = require("express");
const routesApi = express.Router();

const userRouterApi = require("./user-router");

routesApi.use("/user",userRouterApi)

module.exports = routesApi;

const express = require("express");
const routesApi = express.Router();

const userRouterApi = require("./user-router");
const postRouterApi = require("./post-router");

routesApi.use("/user",userRouterApi)
routesApi.use("/post",postRouterApi)

module.exports = routesApi;

const express = require("express");
const routesApi = express.Router();

const userRouterApi = require("./user-router");
const postRouterApi = require("./post-router");
const commentsRouterApi = require("./comments-router");
const errorMiddleware = require("../../middleware/error-middleware");
const adminRouterApi = require("./admin-router");

routesApi.use("/user", userRouterApi);
routesApi.use("/post", postRouterApi);
routesApi.use(
  "/comment",

  commentsRouterApi
);
routesApi.use("/admin", adminRouterApi);

routesApi.use(errorMiddleware); //todo продумать пути!!!

module.exports = routesApi;

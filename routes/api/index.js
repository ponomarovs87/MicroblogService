const express = require("express");
const routesApi = express.Router();

const userRouterApi = require("./user-router");
const postRouterApi = require("./post-router");
const commentsRouterApi = require("./comments-router");

routesApi.use("/user", userRouterApi);
routesApi.use("/post", postRouterApi);
routesApi.use("/comment", commentsRouterApi);

module.exports = routesApi;

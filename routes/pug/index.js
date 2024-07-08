const express = require("express");
const routesPug = express.Router();
const userRouter = require("./user-router");
const postsRouter = require("./posts-router");
const renderController = require("../../controller/pages/render-controller");

routesPug.use(renderController.addAdditionallyInfo);

routesPug.get("/", renderController.renderHomePage);
routesPug.get("/tag/:tagName", renderController.renderHomePageWithTag);

routesPug.use("/user", userRouter);
routesPug.use("/posts", postsRouter);

routesPug.get("/:page", renderController.renderNotFoundPage);
routesPug.use(renderController.renderNotFoundPage);

routesPug.use(renderController.renderErrorPage);

module.exports = routesPug;

const express = require("express");
const postRouterApi = express.Router();

const postController = require("../../controller/post-controller");

postRouterApi.get("/", postController.getAll);
postRouterApi.post("/add", postController.add);
postRouterApi.put("/edit", postController.edit);
postRouterApi.delete("/delete", postController.delete);

module.exports = postRouterApi;

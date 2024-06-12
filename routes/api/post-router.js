const express = require("express");
const postRouterApi = express.Router();

const postController = require("../../controller/post-controller");

postRouterApi.get("/", postController.getAll);
postRouterApi.get("/:postId", postController.getOnce);
postRouterApi.post("/add", postController.add);
postRouterApi.put("/:postId", postController.edit);
postRouterApi.delete("/:postId", postController.delete);

module.exports = postRouterApi;

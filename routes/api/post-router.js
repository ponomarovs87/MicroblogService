const express = require("express");
const postRouterApi = express.Router();

const postController = require("../../controller/post-controller");
const authMiddleware = require("../../middleware/auth-middleware");
const postValidation = require("../../validation/post-validation");

postRouterApi.get("/", postController.getAll);
postRouterApi.get(
  "/:postId",
  postValidation.postIdValidation,
  postController.getOne
);
postRouterApi.post(
  "/add",
  authMiddleware,
  postValidation.postCreateValidator,
  postController.add
);
postRouterApi.put(
  "/:postId",
  authMiddleware,
  postValidation.postIdValidation,
  postValidation.postEditValidator,
  postController.edit
);
postRouterApi.delete(
  "/:postId",
  authMiddleware,
  postValidation.postIdValidation,
  postValidation.postDeleteValidator,
  postController.delete
);

module.exports = postRouterApi;

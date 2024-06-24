const express = require("express");
const postRouterApi = express.Router();

const PostController = require("../../controller/post-controller");
const authMiddleware = require("../../middleware/auth-middleware");
const PostValidation = require("../../validation/post-validation");

postRouterApi.get("/", PostController.getAll);
postRouterApi.get(
  "/:postId",
  PostValidation.postIdValidation,
  PostController.getOnce
);
postRouterApi.post(
  "/add",
  authMiddleware,
  PostValidation.postCreateValidator,
  PostController.add
);
postRouterApi.put(
  "/:postId",
  authMiddleware,
  PostValidation.postIdValidation,
  PostValidation.postEditValidator,
  PostController.edit
);
postRouterApi.delete(
  "/:postId",
  authMiddleware,
  PostValidation.postIdValidation,
  PostValidation.postDeleteValidator,
  PostController.delete
);

module.exports = postRouterApi;

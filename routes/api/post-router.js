const express = require("express");
const postRouterApi = express.Router();

const postController = require("../../controller/post-controller");
const authMiddleware =
  require("../../middleware/auth-middleware")();
const postValidation = require("../../validation/post-validation");

postRouterApi.get("/", postController.getAll);

postRouterApi.post(
  "/add",
  authMiddleware,
  postValidation.postCreateValidator,
  postController.add
);

postRouterApi.param(
  "postId",
  postValidation.postIdValidation
);

postRouterApi
  .route("/:postId")
  .get(postController.getOne)
  .put(
    authMiddleware,
    postValidation.postEditValidator,
    postController.edit
  )
  .delete(
    authMiddleware,
    postValidation.postDeleteValidator,
    postController.delete
  );

module.exports = postRouterApi;

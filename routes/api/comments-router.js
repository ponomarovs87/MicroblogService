const express = require("express");
const commentsRouterApi = express.Router();

const authMiddleware = require("../../middleware/auth-middleware");
const commentValidation = require("../../validation/comment-validation");
const commentController = require("../../controller/comment-controller");
const postValidation = require("../../validation/post-validation");

commentsRouterApi.post(
  "/:postId",
  authMiddleware,
  postValidation.postIdValidation,
  commentValidation.commentCreateValidator,
  commentController.add
);
commentsRouterApi.put(
  "/:postId",
  authMiddleware,
  postValidation.postIdValidation,
  commentValidation.commentEditValidator,
  commentController.edit
);
commentsRouterApi.delete(
  "/:postId",
  authMiddleware,
  postValidation.postIdValidation,
  commentValidation.commentDeleteValidator,
  commentController.delete
);

module.exports = commentsRouterApi;

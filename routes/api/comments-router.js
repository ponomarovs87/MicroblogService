const express = require("express");
const commentsRouterApi = express.Router();

const authMiddleware = require("../../middleware/auth-middleware");
const CommentValidation = require("../../validation/comment-validation");
const CommentController = require("../../controller/comment-controller");
const PostValidation = require("../../validation/post-validation");

commentsRouterApi.post(
  "/:postId",
  authMiddleware,
  PostValidation.postIdValidation,
  CommentValidation.commentCreateValidator,
  CommentController.add
);
commentsRouterApi.put(
  "/:postId",
  authMiddleware,
  PostValidation.postIdValidation,
  CommentValidation.commentEditValidator,
  CommentController.edit
);
commentsRouterApi.delete(
  "/:postId",
  authMiddleware,
  PostValidation.postIdValidation,
  CommentValidation.commentDeleteValidator,
  CommentController.delete
);

module.exports = commentsRouterApi;

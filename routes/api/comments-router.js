const express = require("express");
const commentsRouterApi = express.Router();

const authMiddleware = require("../../middleware/auth-middleware");
const commentValidation = require("../../validation/comment-validation");
const commentController = require("../../controller/comment-controller");
const postValidation = require("../../validation/post-validation");

commentsRouterApi.use(authMiddleware());

commentsRouterApi.param(
  "postId",
  postValidation.postIdValidation
);

commentsRouterApi.route("/:postId")
  .post(
    commentValidation.commentCreateValidator,
    commentController.add
  )
  .put(
    commentValidation.commentEditValidator,
    commentController.edit
  )
  .delete(
    commentValidation.commentDeleteValidator,
    commentController.delete
  );

module.exports = commentsRouterApi;

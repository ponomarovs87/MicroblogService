const express = require("express");
const postsRouter = express.Router();

const renderController = require("../../controller/pages/render-controller");

const accessMiddleware = require("../../middleware/access-middleware");

postsRouter.get(
  "/addNew",
  accessMiddleware(),
  renderController.renderAddNewPostPage
);

postsRouter.get(
  "/myPosts",
  accessMiddleware(),
  renderController.renderMyPostsPage
);

postsRouter.get(
  "/edit/:postId",
  accessMiddleware(),
  renderController.renderEditPostPage
);

postsRouter.get("/:postId", renderController.renderOnePost);

module.exports = postsRouter;

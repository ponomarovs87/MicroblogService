const express = require("express");
const postService = require("../../service/post-service");
const postsRouter = express.Router();

const marked = require("marked");

const tokenService = require("../../service/token-service");
const accessMiddleware =
  require("../../middleware/access-middleware")();

postsRouter.get(
  "/addNew",
  accessMiddleware,
  (req, res, next) => {
    try {
      const { userData } = req.additionally;
      return res.render("pages/posts/editorPost/index", {
        userData,
      });
    } catch (err) {
      next(err);
    }
  }
);

postsRouter.get(
  "/myPosts",
  accessMiddleware,
  async (req, res, next) => {
    try {
      const { userData } = req.additionally;

      const postsData = await postService.getAllByUserId(
        userData.id
      );

      return res.render("pages/posts/myPosts/index", {
        userData,
        postsData,
      });
    } catch (err) {
      next(err);
    }
  }
);

postsRouter.get(
  "/edit/:postId",
  accessMiddleware,
  async (req, res, next) => {
    try {
      const { userData } = req.additionally;

      const postId = +req.params.postId;
      if (isNaN(postId)) {
        return res.render("pages/404");
      }
      try {
        const data = await postService.getOne(postId);

        if (data.userId !== userData.id) {
          return res.redirect("/");
        }

        return res.render("pages/posts/editorPost/index", {
          userData,
          data,
        });
      } catch (err) {
        return res.render("pages/404");
      }
    } catch (err) {
      next(err);
    }
  }
);

postsRouter.get("/:postId", async (req, res, next) => {
  try {
    const postId = +req.params.postId;
    if (isNaN(postId)) {
      return res.render("pages/404");
    }
    try {
      const data = await postService.getOne(postId);

      data.parsedMarkdown = marked.parse(data.markdownText);

      if (
        new Date(data.dateUpdate).getTime ===
        new Date(data.dateCreate).getTime
      ) {
        data.dateUpdate = null;
      }

      const { userData } = req.additionally;

      return res.render("pages/posts/one/index", {
        data,
        userData,
      });
    } catch (err) {
      return res.render("pages/404");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = postsRouter;

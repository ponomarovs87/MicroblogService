const express = require("express");
const postService = require("../../service/post-service");
const postsRouter = express.Router();

const marked = require("marked");
const tokenService = require("../../service/token-service");

const { PrismaClient } = require("@prisma/client");
const accessMiddleware = require("../../middleware/access-middleware");
const prisma = new PrismaClient();

postsRouter.get("/addNew",accessMiddleware, (req, res) => {
  try {
    return res.render("pages/posts/editorPost/index", {
      refreshToken: req.cookies.refreshToken,
    });
  } catch (err) {
    next(err);
  }
});

postsRouter.get("/myPosts",accessMiddleware, async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    const tokenData =
      tokenService.validateRefreshToken(refreshToken);

    const postsData = await prisma.posts.findMany({
      where: {
        userId: tokenData.id,
      },
      include: {
        comments: { include: { user: true } },
      },
      orderBy: {
        dateCreate: "desc",
      },
    });

    return res.render("pages/posts/myPosts/index", {
      refreshToken,
      postsData,
    });
  } catch (err) {
    next(err);
  }
});

postsRouter.get("/edit/:postId",accessMiddleware, async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    const tokenData =
      tokenService.validateRefreshToken(refreshToken);

    const postId = +req.params.postId;
    if (isNaN(postId)) {
      return res.render("pages/404");
    }
    try {
      const data = await postService.getOne(postId);

      if (data.userId !== tokenData.id) {
        return res.redirect("/");
      }

      return res.render("pages/posts/editorPost/index", {
        refreshToken,
        data,
      });
    } catch (err) {
      return res.render("pages/404");
    }
  } catch (err) {
    next(err);
  }
});

postsRouter.get("/:postId", async (req, res) => {
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

      const { refreshToken } = req.cookies;

      if (refreshToken && refreshToken.length > 0) {
        data.client =
          tokenService.validateRefreshToken(refreshToken);
      }

      return res.render("pages/posts/one/index", {
        refreshToken: req.cookies.refreshToken,
        data,
      });
    } catch (err) {
      return res.render("pages/404");
    }
  } catch (err) {
    next(err);
  }
});

module.exports = postsRouter;

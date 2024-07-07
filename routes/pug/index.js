const express = require("express");
const routesPug = express.Router();
const postService = require("../../service/post-service");
const userRouter = require("./user-router");
const postsRouter = require("./posts-router");
const {
  validateRefreshToken,
} = require("../../service/token-service");

routesPug.use((req, _res, next) => {
  req.additionally = {
    userData: validateRefreshToken(
      req.cookies.refreshToken
    ),
  };
  next();
});

routesPug.get("/", async (req, res, next) => {
  const { userData } = req.additionally;
  try {
    const posts = await postService.getAll();

    res.render(
      "pages/home/index",
      { posts, userData },
      (err, html) => {
        if (err) {
          return next(err);
        }
        res.send(html);
      }
    );
  } catch (err) {
    next(err);
  }
});
routesPug.get("/tag/:tagName", async (req, res) => {
  const { userData } = req.additionally;
  const tag = req.params.tagName;
  try {
    const posts = await postService.getAllWithTag(tag);

    res.render(
      "pages/home/index",
      { posts, userData, tag },
      (err, html) => {
        if (err) {
          return next(err);
        }
        res.send(html);
      }
    );
  } catch (err) {
    next(err);
  }
});

routesPug.use("/user", userRouter);
routesPug.use("/posts", postsRouter);

//! временная заглушка Поменять!!!
routesPug.get("/:page", (req, res) => {
  if (req.params.page === "404") {
    return res.status(404).render("pages/404");
  }
  res.render(`pages/${req.params.page}`, (err, html) => {
    if (err) {
      return res.redirect("/404");
    }
    return res.send(html);
  });
});

routesPug.use((err, req, res, next) => {
  console.log(err); // todo убрать перед диплоем
  return res
    .status(500)
    .json({
      message: `непредвиденная ошибка ЭТО PUG ${err}`,
    });
});

module.exports = routesPug;

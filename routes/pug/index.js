const express = require("express");
const routesPug = express.Router();
const postService = require("../../service/post-service");
const userRouter = require("./user-router");

routesPug.get("/", async (req, res, next) => {
  const { refreshToken } = req.cookies;
  try {
    const posts = await postService.getAll();

    res.render(
      "pages/home/index",
      { posts, refreshToken },
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

module.exports = routesPug;

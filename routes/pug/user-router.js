require("dotenv").config();
const config = require("config");

const express = require("express");
const accessMiddleware = require("../../middleware/access-middleware");
const adminService = require("../../service/admin-service");
const commentService = require("../../service/comment-service");
const postService = require("../../service/post-service");

const userRouter = express.Router();

userRouter.get("/registration", (_req, res) => {
  try {
    return res.render("pages/auth/registration/index");
  } catch (err) {
    next(err);
  }
});

userRouter.get("/login", (_req, res) => {
  try {
    return res.render("pages/auth/login/index");
  } catch (err) {
    next(err);
  }
});

userRouter.get(
  "/myAccount",
  accessMiddleware(),
  (req, res) => {
    const { userData } = req.additionally;
    try {
      return res.render("pages/auth/myAccount/index", {
        userData,
      });
    } catch (err) {
      next(err);
    }
  }
);

userRouter.get(
  "/adminPage",
  accessMiddleware(true),
  async (req, res, next) => {
    try {
      const { userData } = req.additionally;
      const { role } = userData;
      if (role !== config.role.adminRole) {
        return res.redirect("/");
      } else {
        const usersData = await adminService.getAllUsers();
        const postsData = await postService.getAll();
        const commentsData = await commentService.getAll();

        

        return res.render("pages/adminPage", {
          userData,
          usersData,
          postsData,
          commentsData,
        });
      }
    } catch (err) {
      next(err);
    }
  }
);

module.exports = userRouter;

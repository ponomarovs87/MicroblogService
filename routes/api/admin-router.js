const express = require("express");
const adminRouterApi = express.Router();

const adminController = require("../../controller/admin-controller");
const authMiddleware = require("../../middleware/auth-middleware");

adminRouterApi.use(authMiddleware(true));

adminRouterApi.get(
  "/getAllUsers",
  adminController.getAllUsers
);
adminRouterApi.delete(
  "/user/:userId",
  adminController.removeUser
);
adminRouterApi.put(
  "/userRole/:userId",
  adminController.editUserRole
);
adminRouterApi.delete(
  "/post/:postId",
  adminController.removePost
);

adminRouterApi.delete(
  "/comment/:commentId",
  adminController.removeComment
);

module.exports = adminRouterApi;

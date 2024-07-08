const express = require("express");
const accessMiddleware = require("../../middleware/access-middleware");
const renderController = require("../../controller/pages/render-controller");

const userRouter = express.Router();

userRouter.get(
  "/registration",
  renderController.renderRegistrationPage
);

userRouter.get("/login", renderController.renderLoginPage);

userRouter.get(
  "/myAccount",
  accessMiddleware(),
  renderController.renderMyAccountPage
);

userRouter.get(
  "/adminPage",
  accessMiddleware(true),
  renderController.renderAdminPage
);

module.exports = userRouter;

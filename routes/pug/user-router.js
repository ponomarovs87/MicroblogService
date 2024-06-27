const express = require("express");
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

userRouter.get("/myAccount", (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      return res.render("pages/auth/myAccount/index",{refreshToken});
    } else {
      return res.redirect("/")
    }
  } catch (err) {
    next(err);
  }
});

// userRouter.post(
//   "/edit",
//   formDataParser,
//   authMiddleware,
//   userValidation.accessValidation,
//   userValidation.userEditValidator,
//   userController.edit
// );

// userRouter.post(
//   "/remove",
//   formDataParser,
//   authMiddleware,
//   userValidation.accessValidation,
//   userController.remove
// );

module.exports = userRouter;

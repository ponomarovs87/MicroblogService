require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const userService = require("../service/user-service");
const ClientError = require("../exceptions/client-errors");
const {
  refreshCookieSave,
  accessCookieSave,
} = require("../middleware/cookie-middleware");

class UserController {
  async registration(req, res, next) {
    req.body.pugPage = "pages/auth/registration/index";
    try {
      const existingUser = await prisma.users.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (existingUser) {
        const errors = {
          email: "пользователь уже существует",
        };

        throw ClientError.ValidationError({
          errors,
          reqData: req.body,
          renderPage: req.body.pugPage,
        });
      }

      const userData = await userService.registration(
        req.body
      );
      refreshCookieSave(res, userData.refreshToken);
      accessCookieSave(res, userData.accessToken);

      return res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
  async login(req, res, next) {
    req.body.pugPage = "pages/auth/login/index";
    try {
      const userData = await userService.login(req.body);
      refreshCookieSave(res, userData.refreshToken);
      accessCookieSave(res, userData.accessToken);
      return res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      if (
        !req.cookies.refreshToken &&
        !req.cookies.accessToken
      ) {
        throw ClientError.BadRequest({
          message: "Выход уже выполнен",
        });
      }
      res.clearCookie("accessToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/" });

      return res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
  async edit(req, res, next) {
    try {

      await userService.edit(req.request);

      res.render("pages/auth/myAccount/index", {
        accessToken: req.cookies.accessToken,
        message: "Данные успешно изменены",
      });
    } catch (err) {
      next(err);
    }
  }
  async remove(req, res, next) {
    try {
      const data = await userService.delete(req.body.email);

      res.clearCookie("accessToken", { path: "/" });
      res.clearCookie("refreshToken", { path: "/" });

      return res.redirect("/");
    } catch (err) {
      next(err);
    }
  }
  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(
        refreshToken
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: true,
      });

      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

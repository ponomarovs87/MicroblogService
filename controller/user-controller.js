require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ApiError = require("../exceptions/api-errors");
const userService = require("../service/user-service");
const tokenService = require("../service/token-service");

class UserController {
  async registration(req, res, next) {
    try {
      const existingUser = await prisma.users.findUnique({
        where: {
          email: req.body.email,
        },
      });
      if (existingUser) {
        throw ApiError.BadRequest(
          "Пользователь с таким адресом электронной почты уже существует",
          {
            email:
              "Пользователь с таким адресом электронной почты уже существует",
          },
          req.body
        );
      }

      const userData = await userService.registration(
        req.body
      );
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: config.cookie.refreshTokenMaxAge,
        httpOnly: true,
        secure: true,
      });

      return res.status(201).json(userData);
    } catch (err) {
      next(err);
    }
  }
  async login(req, res, next) {
    try {
      const userData = await userService.login(req.body);
      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: config.cookie.refreshTokenMaxAge,
        httpOnly: true,
        secure: true,
      });
      return res.status(200).json(userData);
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      if (
        !req.cookies.refreshToken ||
        req.cookies.refreshToken === ""
      ) {
        throw ApiError.BadRequest("Выход уже выполнен");
      }
      const token = await userService.logout(
        req.cookies.refreshToken
      );
      res.clearCookie("refreshToken");
      res.json(token);
    } catch (err) {
      next(err);
    }
  }
  async edit(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const tokenData =
        await tokenService.validateRefreshToken(
          refreshToken
        );
      if (req.body.email !== tokenData.email) {
        throw ApiError.Forbidden(
          `Зайдите под аккаунтом ${req.body.email}`
        );
      }
      if (req.body.newUserData.email !== req.body.email) {
        const existingUser = await prisma.users.findUnique({
          where: {
            email: req.body.newUserData.email,
          },
        });
        if (existingUser) {
          throw ApiError.BadRequest(
            "Пользователь с таким адресом электронной почты уже существует",
            {
              email:
                "Пользователь с таким адресом электронной почты уже существует",
            },
            req.body
          );
        }
      }
      const userData = await userService.edit(req.body);

      res.cookie("refreshToken", userData.refreshToken, {
        maxAge: config.cookie.refreshTokenMaxAge,
        httpOnly: true,
        secure: true,
      });

      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const tokenData =
        await tokenService.validateRefreshToken(
          refreshToken
        );
      if (req.body.email !== tokenData.email) {
        throw ApiError.Forbidden(
          `Зайдите под аккаунтом ${req.body.email}`
        );
      }
      const data = await userService.delete(req.body.email);
      res.clearCookie("refreshToken");
      return res.json(data);
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
        maxAge: config.cookie.refreshTokenMaxAge,
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

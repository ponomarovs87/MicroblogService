const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ApiError = require("../exceptions/api-errors");
const userService = require("../service/user-service");

class UserController {
  async registration(req, res, next) {
    try {
      // Проверяем, существует ли пользователь с таким же адресом электронной почты
      const existingUser = await prisma.users.findUnique({
        where: {
          email: req.body.email,
        },
      });

      // Если пользователь уже существует, отправляем ответ с ошибкой
      if (existingUser) {
        throw ApiError.BadRequest(
          "Пользователь с таким адресом электронной почты уже существует",
          {
            email:
              "Пользователь с таким адресом электронной почты уже существует",
          },req.body
        );
      }

      const userData = await userService.registration(
        req.body
      );

      return res.status(201).json(userData);
    } catch (err) {
      next(err);
    }
  }
  async login(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async edit(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async refresh(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const ApiError = require("../exceptions/api-errors");

class UserService {
  async registration(reqData) {
    const { password, ...rest } = reqData;

    try {
      const hashPassword = await bcrypt.hash(
        password,
        config.bcrypt.salt
      );

      const data = {
        ...rest,
        hashPassword,
      };

      // Создание новой записи пользователя в базе данных
      const newUser = await prisma.users.create({
        data: {
          ...data,
        },
      });

      return newUser;
    } catch (err) {
      next(err);
    }
  }
  async login({ password, email }) {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw ApiError.BadRequest("Пользователь не найден", {
        email: "Пользователь не найден",
      });
    }

    const isPassEquals = await bcrypt.compare(
      password,
      user.hashPassword
    );
    if (!isPassEquals) {
      throw ApiError.BadRequest(`Неверный пароль`, {
        password: `Неверный пароль`,
      });
    }

    return "success"; // todo возможно токен-сервис нужен
  }
  async logout() {
    return "success"; // todo если удалять токен
  }
  async edit(reqData) {

    const { email, newUserData } = reqData;

    const { password, ...rest } = newUserData;

    const hashPassword = await bcrypt.hash(
      password,
      config.bcrypt.salt
    );

    const data = {
      ...rest,
      hashPassword,
    };
    
    const updatedUser = await prisma.users.update({
      where: {
        email,
      },
      data: {
        ...data,
      },
    });
    return updatedUser;
  }
  async delete(email){
     await prisma.users.delete({
      where: {
        email
      }
    })
    console.log();
    return "success"
  }
}

module.exports = new UserService();

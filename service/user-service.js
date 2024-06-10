require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");


class UserService {
  async registration(reqData) {
    const { password ,...rest} = reqData;

    try {

      const hashPassword = await bcrypt.hash(password, config.bcrypt.salt);

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
}

module.exports = new UserService();

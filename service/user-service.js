require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const ApiError = require("../exceptions/api-errors");
const tokenService = require("./token-service");

const { refreshToken } = require("../config/default");

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
      const user = await prisma.users.create({
        data: {
          ...data,
        },
      });

      const tokens = tokenService.generateToken({
        id: user.id,
        email: user.email,
      });
      await tokenService.saveToken(
        user.id,
        tokens.refreshToken
      );

      return {
        ...tokens,
        user,
      };
    } catch (err) {
      console.log(error);
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
    const tokens = tokenService.generateToken({
      id: user.id,
      email: user.email,
    });
    await tokenService.saveToken(
      user.id,
      tokens.refreshToken
    );

    return {
      ...tokens,
      user,
    };
  }
  async logout(refreshToken) {
    const token = await tokenService.removeToken(
      refreshToken
    );
    return token;
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
    const tokens = tokenService.generateToken({
      id: updatedUser.id,
      email: updatedUser.email,
    });
    await tokenService.saveToken(
      updatedUser.id,
      tokens.refreshToken
    );

    return {
      ...tokens,
      updatedUser,
    };
  }
  async delete(email) {
    await prisma.users.delete({
      where: {
        email,
      },
    });
    return "success";
  }
  async refresh(refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData =
      tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.fiendToken(
      refreshToken
    );
    if (!userData || !tokenFromDB || userData.id !== tokenFromDB.userId) {
      res.clearCookie("refreshToken");
      throw ApiError.UnauthorizedError();
    }

    const user = await prisma.users.findUnique({
      where: {
        id: userData.id,
      },
    });
    if (!user) {
      res.clearCookie("refreshToken");
      throw ApiError.UnauthorizedError();
    }
    const tokens = tokenService.generateToken({
      id: user.id,
      email: user.email,
    });

    await tokenService.saveToken(
      user.id,
      tokens.refreshToken
    );

    return {
      ...tokens,
      user,
    };
  }
}

module.exports = new UserService();

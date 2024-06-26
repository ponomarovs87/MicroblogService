require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const apiError = require("../exceptions/api-errors");
const tokenService = require("./token-service");

const { refreshToken } = require("../config/default");
const ClientError = require("../exceptions/client-errors");

class UserService {
  async registration(reqData) {
    const { password, pugPage, ...rest } = reqData;

    try {
      const hashPassword = await bcrypt.hash(
        password,
        config.bcrypt.salt
      );

      const data = {
        ...rest,
        hashPassword,
      };

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
      next(err);
    }
  }
  async login({ password, email, pugPage }) {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      const message = `Пользователя с email ${email} не существует `;
      throw ClientError.BadRequest({
        message,
        errors: { email: message },
        renderPage: pugPage,
      });
    }

    const isPassEquals = await bcrypt.compare(
      password,
      user.hashPassword
    );
    if (!isPassEquals) {
      throw ClientError.Forbidden({ renderPage: pugPage });
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
    return updatedUser;
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
      throw apiError.UnauthorizedError();
    }
    const userData =
      tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.fiendToken(
      refreshToken
    );
    if (!userData || !tokenFromDB) {
      throw apiError.UnauthorizedError();
    }

    const user = await await prisma.users.findUnique({
      where: {
        id: userData.id,
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
  }
}

module.exports = new UserService();

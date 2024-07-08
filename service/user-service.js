require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

const ApiError = require("../exceptions/api-errors");
const tokenService = require("./token-service");

const clearCookieRefreshToken = require("../helper/clearCookieRefreshToken");

class UserService {
  async #generateAndSaveTokens(user) {
    const tokens = tokenService.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    await tokenService.saveToken(
      user.id,
      tokens.refreshToken
    );
    return tokens;
  }

  async existingUser(email, fullData = false) {
    const user = await prisma.users.findUnique({
      where: { email },
    });
    return fullData ? user : !!user;
  }

  async checkRole(id) {
    const user = await prisma.users.findUnique({
      where: { id },
    });
    return user ? user.role : null;
  }

  async registration(reqData) {
    const { password, ...rest } = reqData;
    try {
      const hashPassword = await bcrypt.hash(
        password,
        config.bcrypt.salt
      );
      const user = await prisma.users.create({
        data: { ...rest, hashPassword },
      });

      const tokens = await this.#generateAndSaveTokens(
        user
      );
      return { ...tokens, user };
    } catch (err) {
      next(err);
    }
  }
  async login({ password, email }) {
    const user = await this.existingUser(email, true);
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
      throw ApiError.BadRequest(
        `Неверный пароль или логин`,
        {
          password: `Неверный пароль или логин`,
        }
      );
    }
    const tokens = await this.#generateAndSaveTokens(user);

    return {
      ...tokens,
      user,
    };
  }
  async logout(refreshToken) {
    return await tokenService.removeToken(refreshToken);
  }
  async edit(reqData) {
    const { email, newUserData } = reqData;

    const { password, ...rest } = newUserData;

    const hashPassword = await bcrypt.hash(
      password,
      config.bcrypt.salt
    );

    const updatedUser = await prisma.users.update({
      where: {
        email,
      },
      data: {
        ...rest,
        hashPassword,
      },
    });
    const tokens = await this.#generateAndSaveTokens(
      updatedUser
    );
    return { ...tokens, updatedUser };
  }
  async delete(email) {
    return await prisma.users.delete({
      where: {
        email,
      },
    });
  }
  async refresh(response, refreshToken) {
    if (!refreshToken) {
      throw ApiError.UnauthorizedError();
    }
    const userData =
      tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = await tokenService.fiendToken(
      refreshToken
    );
    if (
      !userData ||
      !tokenFromDB ||
      userData.id !== tokenFromDB.userId
    ) {
      clearCookieRefreshToken(response);
      throw ApiError.UnauthorizedError();
    }

    const user = await prisma.users.findUnique({
      where: {
        id: userData.id,
      },
    });
    if (!user) {
      clearCookieRefreshToken(response);
      throw ApiError.UnauthorizedError();
    }
    const tokens = await this.#generateAndSaveTokens(user);
    return { ...tokens, user };
  }
}

module.exports = new UserService();

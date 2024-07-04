require("dotenv").config();
const config = require("config");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TokenService {
  generateToken(payload) {
    try {
      const accessToken = jwt.sign(
        payload,
        config.accessToken.secret,
        {
          expiresIn: config.accessToken.expiresIn,
        }
      );
      const refreshToken = jwt.sign(
        payload,
        config.refreshToken.secret,
        {
          expiresIn: config.refreshToken.expiresIn,
        }
      );
      return {
        accessToken,
        refreshToken,
      };
    } catch (err) {
      console.log(err); // todo убрать перед диплоем
    }
  }
  async saveToken(userId, refreshToken) {
    const tokenData = await prisma.token.findUnique({
      where: {
        userId,
      },
    });
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return await prisma.token.update({
        where: {
          userId,
        },
        data: {
          ...tokenData,
        },
      });
    }
    const token = await prisma.token.create({
      data: {
        userId,
        refreshToken,
      },
    });
    return token;
  }
  async removeToken(refreshToken) {
    try {
      const tokenData = await prisma.token.delete({
        where: {
          refreshToken,
        },
      });
      return tokenData;
    } catch (error) {
      return error
    }
  }
  validateRefreshToken(token) {
    try {
      const tokenData = jwt.verify(
        token,
        config.refreshToken.secret
      );
      return tokenData;
    } catch (err) {
      return null;
    }
  }
  validateAccessToken(token) {
    try {
      const tokenData = jwt.verify(
        token,
        config.accessToken.secret
      );
      return tokenData;
    } catch (err) {
      return null;
    }
  }
  async fiendToken(refreshToken) {
    const tokenData = await prisma.token.findUnique({
      where: {
        refreshToken,
      },
    });
    return tokenData;
  }
}

module.exports = new TokenService();

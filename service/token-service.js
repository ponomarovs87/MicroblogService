require("dotenv").config();
const config = require("config");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class TokenService {
  generateToken(payload) {
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
    return await prisma.token.create({
      data: {
        userId,
        refreshToken,
      },
    });
  }
  async removeToken(refreshToken) {
    try {
      return await prisma.token.delete({
        where: {
          refreshToken,
        },
      });
    } catch (error) {
      return error;
    }
  }
  validateRefreshToken(token) {
    try {
      return jwt.verify(token, config.refreshToken.secret);
    } catch (err) {
      return null;
    }
  }
  validateAccessToken(token) {
    try {
      return jwt.verify(token, config.accessToken.secret);
    } catch (err) {
      return null;
    }
  }
  async fiendToken(refreshToken) {
    return await prisma.token.findUnique({
      where: {
        refreshToken,
      },
    });
  }
}

module.exports = new TokenService();

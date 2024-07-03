const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ApiError = require("../exceptions/api-errors");
const tokenService = require("../service/token-service");

module.exports = async function (req, res, next) {
  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      return next(ApiError.UnauthorizedError());
    }
    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      return next(ApiError.UnauthorizedError());
    }
    const userData =
      tokenService.validateAccessToken(accessToken);
    if (!userData) {
      return next(ApiError.UnauthorizedError());
    }
    const existingUser = await prisma.users.findUnique({
      where: {
        id: userData.id,
      },
    });

    if (!existingUser || existingUser.email !== userData.email) {
      res.clearCookie("refreshToken");
      return next(ApiError.UnauthorizedError());
    }

    req.user = userData;
    next();
  } catch (err) {
    next(ApiError.UnauthorizedError());
  }
};

const ApiError = require("../../exceptions/api-errors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class validationHelper {
  paramsWayNumberValidation = (postId) => {
    const id = +postId;

    if (!id || isNaN(id)) {
      throw ApiError.BadRequest("Некоректний адрес поста");
    }

    return id;
  };

  validatePostExists = async (postId) => {
    const data = await prisma.posts.findUnique({
      where: { id: postId },
    });
    if (!data) {
      throw ApiError.NotFound("Такого поста не существует");
    }
    return data;
  };

  checkOwnership = (postAuthorId, userId) => {
    if (postAuthorId !== userId) {
      throw ApiError.Forbidden()
    }
  };
}

module.exports = new validationHelper();

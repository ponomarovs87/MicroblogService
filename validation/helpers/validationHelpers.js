const apiError = require("../../exceptions/api-errors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class validationHelper {
  paramsWayNumberValidation(postId) {
    const id = +postId;

    if (!id || isNaN(id)) {
      throw apiError.BadRequest("Некоректний адрес поста");
    }

    return id;
  }

  async validatePostExists(postId) {
    const data = await prisma.posts.findUnique({
      where: { id: postId },
    });
    if (!data) {
      throw apiError.NotFound("Такого поста не существует");
    }
    return data;
  }

  async validateCommentExists(commentId) {
    const data = await prisma.comments.findUnique({
      where: { id: commentId },
    });
    if (!data) {
      throw apiError.NotFound(
        "Такого комментария не существует"
      );
    }
    return data;
  }

  checkOwnership(postAuthorId, userId) {
    if (postAuthorId !== userId) {
      throw apiError.Forbidden();
    }
  }

  formatValidationErrors(err) {
    let errors = {};
    err.inner.forEach((error) => {
      if (!errors[error.path]) {
        errors[error.path] = [];
      }
      errors[error.path].push(error.message);
    });
    return errors;
  }
}

module.exports = new validationHelper();

const ApiError = require("../exceptions/api-errors");
const { PrismaClient } = require("@prisma/client");
const postCreateSchema = require("./schema/postCreateSchema");
const prisma = new PrismaClient();

class PostValidation {
  async postCreateValidator(req, _res, next) {
    try {
      req.body = await postCreateSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (err) {
      let errors = {};
      err.inner.forEach((error) => {
        if (!errors[error.path]) {
          errors[error.path] = [];
        }
        errors[error.path].push(error.message);
      });

      next(ApiError.ValidationError(errors, req.body));
    }
  }

  async postEditValidator(req, _res, next) {
    try {
      const postId = +req.body.postId;

      const data = await prisma.posts.findUnique({
        where: {
          id: postId,
        },
      });

      if (!postId || !data || isNaN(postId)) {
        throw ApiError.BadRequest(
          "Изменяемый пост не доступен"
        );
      }

      const postAuthor = data.userId;

      const userId = req.user.id;

      if (postAuthor !== userId) {
        throw ApiError.BadRequest(
          "У вас нет доступа для изменяи этого поста"
        );
      }
      req.body.postId = postId
      try {
        req.body.newPostData = await postCreateSchema.validate(
          req.body.newPostData,
          {
            abortEarly: false,
            stripUnknown: true,
          }
        );
      } catch (err) {
        let errors = {};
        err.inner.forEach((error) => {
          if (!errors[error.path]) {
            errors[error.path] = [];
          }
          errors[error.path].push(error.message);
        });

        next(ApiError.ValidationError(errors, req.body));
      }

      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostValidation();

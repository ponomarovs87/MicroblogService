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
      try {
        const postId = +req.params.postId;

        if (isNaN(postId)) {
          throw ApiError.BadRequest(
            "Некоректний адрес поста"
          );
        }

        const data = await prisma.posts.findUnique({
          where: {
            id: postId,
          },
        });
        if (!postId || !data) {
          throw ApiError.BadRequest(
            "Изменяемый пост не доступен"
          );
        }
        req.body.postId = postId;

        req.body.postAuthorId = data.userId;
      } catch (err) {
        next(err);
      }

      if (req.body.postAuthorId !== req.user.id) {
        throw ApiError.BadRequest(
          "У вас нет доступа для изменяи этого поста"
        );
      }

      try {
        req.body.newPostData =
          await postCreateSchema.validate(
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

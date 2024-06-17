const ApiError = require("../exceptions/api-errors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const postCreateSchema = require("./schema/postCreateSchema");

const validationHelper = require("./helpers/validationHelpers");

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
      const id = validationHelper.paramsWayNumberValidation(
        req.params.postId
      );

      const data =
        await validationHelper.validatePostExists(id);

      req.body.postId = data.id;
      req.body.postAuthorId = data.userId;

      validationHelper.checkOwnership(
        req.body.postAuthorId,
        req.user.id
      );

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

        throw ApiError.ValidationError(errors, req.body);
      }

      next();
    } catch (err) {
      next(err);
    }
  }

  async postDeleteValidator(req, _res, next) {
    try {
      const id = validationHelper.paramsWayNumberValidation(
        req.params.postId
      );

      const data =
        await validationHelper.validatePostExists(id);

      req.body.postId = data.id;
      req.body.postAuthorId = data.userId;

      validationHelper.checkOwnership(
        req.body.postAuthorId,
        req.user.id
      );

      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostValidation();

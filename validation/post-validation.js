const ApiError = require("../exceptions/api-errors");
const { PrismaClient } = require("@prisma/client");
const postCreateSchema = require("./schema/postCreateShema");
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

  async accessValidation(req, _res, next) {
    try {
      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostValidation();

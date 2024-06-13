const ApiError = require("../exceptions/api-errors");
const userCreateSchema = require("./schema/userCreateSchema");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

class UserValidation {
  async userCreateValidator(req, _res, next) {
    try {
      req.body = await userCreateSchema.validate(req.body, {
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
      //todo переделать в ApiError хз
      
       next(ApiError.ValidationError(errors, req.body));
    }
  }
  async userEditValidator(req, _res, next) {
    try {
      req.body.newUserData =
        await userCreateSchema.validate(
          req.body.newUserData,
          {
            abortEarly: false,
            stripUnknown: true,
          }
        );
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
      const { email, password } = req.body;
      const user = await prisma.users.findUnique({
        where: {
          email,
        },
      });
      let isPassEquals;
      if (user) {
        isPassEquals = await bcrypt.compare(
          password,
          user.hashPassword
        );
      }
      if (!user || !isPassEquals) {
        throw ApiError.BadRequest("Нет Доступа");
      }
      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserValidation();

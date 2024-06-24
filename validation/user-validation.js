
const apiError = require("../exceptions/api-errors");
const validationHelpers = require("./helpers/validationHelpers");

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
      const errors =
      validationHelpers.formatValidationErrors(err);

      //todo переделать в ApiError хз придумаю позже выглядит мрак
      next(apiError.ValidationError(errors, req.body));
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
      const errors =
        validationHelpers.formatValidationErrors(err);

      next(apiError.ValidationError(errors, req.body));
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

        throw apiError.Forbidden()
      }
      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserValidation();

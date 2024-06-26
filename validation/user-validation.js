const apiError = require("../exceptions/api-errors");
const ClientError = require("../exceptions/client-errors");
const validationHelpers = require("./helpers/validationHelpers");

const userCreateSchema = require("./schema/userCreateSchema");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

class UserValidation {
  async userCreateValidator(req, res, next) {
    try {
      req.body = await userCreateSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
      });
      next();
    } catch (err) {

      const errors =
        validationHelpers.formatValidationErrors(err);

      next(
        ClientError.ValidationError({
          errors,
          reqData: req.body,
          renderPage: "pages/auth/registration/index",
        })
      );
    }
  }
  //!
  async userEditValidator(req, _res, next) {
    req.request = {
      email: req.body.email,
      password: req.body.password,
      newUserData: {
        email: req.body.newUserEmail,
        password: req.body.newUserPassword,
        surname: req.body.newUserSurname,
        name: req.body.newUserName,
        birthDate: req.body.newUserBirthDate,
      },
    };
    try {
      req.body.newUserData =
        await userCreateSchema.validate(
          req.request.newUserData,
          {
            abortEarly: false,
            stripUnknown: true,
          }
        );
      next();
    } catch (err) {
      const errors =
        validationHelpers.formatValidationErrors(err);
      next(
        ClientError.ValidationError({
          errors,
          reqData: req.request,
          renderPage: "pages/auth/myAccount/index",
        })
      );
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
        throw ClientError.Forbidden({});
      }
      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserValidation();

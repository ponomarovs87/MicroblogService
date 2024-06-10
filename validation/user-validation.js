const ApiError = require("../exceptions/api-errors");
const userCreateSchema = require("./schema/userCreateSchema");

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
      //todo переделать в ApiError
      err = ApiError.ValidationError(errors, req.body);
      return next(err);
    }
  }
}

module.exports = new UserValidation();

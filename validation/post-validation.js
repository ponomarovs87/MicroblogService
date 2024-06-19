const ApiError = require("../exceptions/api-errors");

const postCreateSchema = require("./schema/postCreateSchema");
const validationHelper = require("./helpers/validationHelpers");

class PostValidation {
  constructor() {
    this.postCreateValidator =
      this.postCreateValidator.bind(this);
    this.postEditValidator =
      this.postEditValidator.bind(this);
  }

  async postIdValidation(req, _res, next) {
    try {
      req.body.postId =
        validationHelper.paramsWayNumberValidation(
          req.params.postId
        );
      next();
    } catch (err) {
      next(err);
    }
  }
  async postCreateValidator(req, _res, next) {
    try {
      req.body = await postCreateSchema.validate(req.body, {
        abortEarly: false,
        stripUnknown: false,
      });
      next();
    } catch (err) {
      const errors =
        validationHelper.formatValidationErrors(err);

      next(ApiError.ValidationError(errors, req.body));
    }
  }

  async postEditValidator(req, _res, next) {
    try {
      const data =
        await validationHelper.validatePostExists(
          req.body.postId
        );

      validationHelper.checkOwnership(
        data.userId,
        req.user.id
      );

      await this.postCreateValidator(req, _res, next);
    } catch (err) {
      next(err);
    }
  }

  async postDeleteValidator(req, _res, next) {
    try {
      const data =
        await validationHelper.validatePostExists(
          req.body.postId
        );

      validationHelper.checkOwnership(
        data.userId,
        req.user.id
      );

      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostValidation();

const apiError = require("../exceptions/api-errors");

const validationHelper = require("./helpers/validationHelpers");
const commentCreateSchema = require("./schema/commentCreateSchema");

class CommentValidation {
  constructor() {
    this.commentCreateValidator =
      this.commentCreateValidator.bind(this);
    this.commentEditValidator =
      this.commentEditValidator.bind(this);
  }

  async commentCreateValidator(req, _res, next) {
    try {
      req.body = await commentCreateSchema.validate(
        req.body,
        {
          abortEarly: false,
          stripUnknown: false,
        }
      );
      next();
    } catch (err) {
      const errors =
        validationHelper.formatValidationErrors(err);

      next(apiError.ValidationError(errors, req.body));
    }
  }

  async commentEditValidator(req, _res, next) {
    try {
      const commentData =
        await validationHelper.validateCommentExists(
          req.body.commentId
        );

      validationHelper.checkOwnership(
        commentData.userId,
        req.user.id
      );

      await this.commentCreateValidator(req, _res, next);
    } catch (err) {
      next(err);
    }
  }

  async commentDeleteValidator(req, _res, next) {
    try {
      const commentData =
        await validationHelper.validateCommentExists(
          req.body.commentId
        );

      validationHelper.checkOwnership(
        commentData.userId,
        req.user.id
      );

      next();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CommentValidation();

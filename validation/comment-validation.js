const apiError = require("../exceptions/api-errors");

const ValidationHelper = require("./helpers/ValidationHelpers");
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
        ValidationHelper.formatValidationErrors(err);

      next(apiError.ValidationError(errors, req.body));
    }
  }

  async commentEditValidator(req, _res, next) {
    try {
      const commentData =
        await ValidationHelper.validateCommentExists(
          req.body.commentId
        );

      ValidationHelper.checkOwnership(
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
        await ValidationHelper.validateCommentExists(
          req.body.commentId
        );

      ValidationHelper.checkOwnership(
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

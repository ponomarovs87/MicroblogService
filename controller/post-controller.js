const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ApiError = require("../exceptions/api-errors");
const UserService = require("../service/user-service");
const PostService = require("../service/post-service");
const ValidationHelpers = require("../validation/helpers/ValidationHelpers");

class PostController {
  async getAll(_req, res, next) {
    try {
      const data = await PostService.getAll();
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async getOnce(req, res, next) {
    try {
      //!!!todo мрак переделать c одной стороны одна валидация, с другой хз ну я уже вынес валидацию!!!
      await ValidationHelpers.validatePostExists(
        req.body.postId
      );

      const data = await PostService.getOnce(
        req.body.postId
      );

      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async add(req, res, next) {
    try {
      const newPostData = {
        userId: req.user.id,
        ...req.body,
      };

      const data = await PostService.add(newPostData);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async edit(req, res, next) {
    try {
      const data = await PostService.edit(req.body);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const data = await PostService.delete(
        req.body.postId
      );
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();

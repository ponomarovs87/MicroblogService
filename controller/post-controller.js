const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ApiError = require("../exceptions/api-errors");
const userService = require("../service/user-service");
const postService = require("../service/post-service");
const validationHelpers = require("../validation/helpers/validationHelpers");

class PostController {
  async getAll(_req, res, next) {
    try {
      const data = await postService.getAll();
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async getOnce(req, res, next) {
    try {
      //!!!todo мрак переделать c одной стороны одна валидация, с другой хз ну я уже вынес валидацию!!!
      await validationHelpers.validatePostExists(req.body.postId);

      const data = await postService.getOnce(req.body.postId);

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

      const data = await postService.add(newPostData);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async edit(req, res, next) {
    try {
      const data = await postService.edit(req.body);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const data = await postService.delete(
        req.body.postId
      );
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ApiError = require("../exceptions/api-errors");
const userService = require("../service/user-service");
const postService = require("../service/post-service");
const validationHelpers = require("../validation/helpers/validationHelpers");

class PostController {
  async getAll(req, res, next) {
    const data = await postService.getAll();
    res.send(data);
  }
  async getOnce(req, res, next) {
    try {
      const postId =
        validationHelpers.paramsWayNumberValidation(
          req.params.postId
        );

      const data =
        await validationHelpers.validatePostExists(postId);
        
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

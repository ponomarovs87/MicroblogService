const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const ApiError = require("../exceptions/api-errors");
const userService = require("../service/user-service");
const postService = require("../service/post-service");

class PostController {
  async getAll(req, res, next) {
    const data = await postService.getAll();
    res.send(data);
  }
  async getOnce(req, res, next) {
    try {
      const postId = +req.params.postId;
      if (isNaN(postId)) {
        throw ApiError.BadRequest(
          "Некорректный адрес поста"
        );
      }
      const data = await postService.getOnce(postId);
      if (!data) {
        throw ApiError.BadRequest("Пост не найден");
      }
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async add(req, res, next) {
    const newPostData = {
      userId: req.user.id,
      ...req.body,
    };

    const data = await postService.add(newPostData);
    res.send(data);
  }
  async edit(req, res, next) {
    const data = await postService.edit();
    res.send(data);
  }
  async delete(req, res, next) {
    const data = await postService.delete();
    res.send(data);
  }
}

module.exports = new PostController();

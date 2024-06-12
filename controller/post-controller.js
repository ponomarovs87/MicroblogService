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
  async getOnce(req,res,next){
    const data = await postService.getOnce();
    res.send(data)
  }
  async add(req, res, next) {
    const data = await postService.add();
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

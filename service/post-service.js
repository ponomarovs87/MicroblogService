require("dotenv").config();
const config = require("config");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const bcrypt = require("bcrypt");
const ApiError = require("../exceptions/api-errors");

class PostService {
  async getAll() {
    const data = await prisma.posts.findMany(); // todo переделать под 10-15 постов за раз
    return data;
  }
  async getOnce(postId) {
    // todo доделать чтобы вместо(вдобавок прилетали данные юзера кто создал имя фамилия)
    const data = await prisma.posts.findUnique({
      where: {
        id: postId,
      },
    });
    return data;
  }
  async add(newPostData) {
    const data = await prisma.posts.create({
      data: {
        ...newPostData,
      },
    });
    return data;
  }
  async edit(reqData) {
    const { postId, newPostData } = reqData;

    const updatedUser = await prisma.posts.update({
      where: {
        id: postId,
      },
      data: {
        ...newPostData,
      },
    });
    return updatedUser;
  }
  async delete() {
    return "edit";
  }
}

module.exports = new PostService();

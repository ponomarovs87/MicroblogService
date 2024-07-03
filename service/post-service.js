const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class PostService {
  async getAll() {
    //!!!! ДОБАВИТЬ DTO оооочень надо
    const data = await prisma.posts.findMany({
      include: {
        comments: { include: { user: true } },
        user: true,
      },
      orderBy: {
        dateCreate: "desc",
      },
    });
    return data;
  }
  async getAllWithTag(tag) {
    const data = await prisma.posts.findMany({
      where: {
        tags: {
          contains: tag,
        },
      },
      include: {
        comments: { include: { user: true } },
        user: true,
      },
      orderBy: {
        dateCreate: "desc",
      },
    });
    return data;
  }
  async getOne(postId) {
    // todo доделать чтобы вместо(вдобавок прилетали данные юзера кто создал имя фамилия)
    const data = await prisma.posts.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          include: { user: true },
          orderBy: {
            dateCreate: "desc",
          },
        },
        user: true,
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
    const { postId, ...newPostData } = reqData;

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
  async delete(postId) {
    const updatedUser = await prisma.posts.delete({
      where: {
        id: postId,
      },
    });
    return updatedUser;
  }
}

module.exports = new PostService();

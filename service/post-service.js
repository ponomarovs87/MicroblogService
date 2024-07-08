const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dtoService = require("./dto-service");

class PostService {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getAllWithTag = this.getAllWithTag.bind(this);
    this.getOne = this.getOne.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  async #getPosts(where, orderBy) {
    const data = await prisma.posts.findMany({
      where,
      include: {
        comments: { include: { user: true } },
        user: true,
      },
      orderBy: {
        dateCreate: orderBy,
      },
    });

    const answer = this.#mapDataDTOs(data);

    return answer;
  }

  async #getPostById(postId) {
    const data = await prisma.posts.findUnique({
      where: { id: postId },
      include: {
        comments: {
          include: { user: true },
          orderBy: { dateCreate: "desc" },
        },
        user: true,
      },
    });

    if (!data) return null;

    return this.#mapDataDTO(data);
  }

  #mapDataDTOs(data) {
    return data.map((item) => this.#mapDataDTO(item));
  }

  #mapDataDTO(data) {
    data.user = dtoService.clearUserData(data.user);
    data.comments = data.comments.map((comment) => {
      comment.user = dtoService.clearUserData(comment.user);
      return comment;
    });
    return data;
  }

  async getAll() {
    return await this.#getPosts({}, "desc");
  }

  async getAllByUserId(userId) {
    return await this.#getPosts(
      {
        userId,
      },
      "desc"
    );
  }

  async getAllWithTag(tag) {
    return await this.#getPosts(
      { tags: { contains: tag } },
      "desc"
    );
  }

  async getOne(postId) {
    return await this.#getPostById(postId);
  }

  async add(newPostData) {
    return await prisma.posts.create({
      data: newPostData,
    });
  }

  async edit(reqData) {
    const { postId, ...newPostData } = reqData;
    return await prisma.posts.update({
      where: { id: postId },
      data: newPostData,
    });
  }

  async delete(postId) {
    return await prisma.posts.delete({
      where: { id: postId },
    });
  }
}

module.exports = new PostService();

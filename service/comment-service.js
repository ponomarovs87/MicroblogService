const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CommentService {
  async getAll() {
    return prisma.comments.findMany();
  }

  async add(comment) {
    return prisma.comments.create({
      data: {
        ...comment,
      },
    });
  }
  async edit(commentId, commentData) {
    return prisma.comments.update({
      where: {
        id: commentId,
      },
      data: {
        ...commentData,
      },
    });
  }
  async delete(commentId) {
    return prisma.comments.delete({
      where: {
        id: commentId,
      },
    });
  }
}

module.exports = new CommentService();

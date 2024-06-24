// const validationHelpers = require("../validation/helpers/validationHelpers");

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class CommentController {
  async add(req, res, next) {
    try {
      // todo возможно стоит сделать DTO

      const comment = {
        userId: req.user.id,
        context: req.body.context,
        postId: req.body.postId,
      };

      const data = await prisma.comments.create({
        data: {
          ...comment,
        },
      });

      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async edit(req, res, next) {
    try {
      // todo возможно стоит сделать DTO #2 !!!

      const comment = {
        userId: req.user.id,
        context: req.body.context,
        postId: req.body.postId,
      };

      const data = await prisma.comments.update({
        where: {
          id: req.body.commentId,
        },
        data: {
          ...comment,
        },
      });

      res.send(data);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const data = await prisma.comments.delete({
        where: {
          id: req.body.commentId,
        },
      });
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CommentController();

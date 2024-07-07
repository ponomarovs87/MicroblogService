const commentService = require("../service/comment-service");

class CommentController {

  constructor() {
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  #createComment(req) {
    return {
      userId: req.user.id,
      context: req.body.context,
      postId: req.body.postId,
    };
  }

  async add(req, res, next) {
    try {
      const comment = this.#createComment(req);
      const data = await commentService.add(comment);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }

  async edit(req, res, next) {
    try {
      const comment = this.#createComment(req);
      const data = await commentService.edit(
        req.body.commentId,
        comment
      );
      res.send(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const data = await commentService.delete(
        req.body.commentId
      );
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CommentController();

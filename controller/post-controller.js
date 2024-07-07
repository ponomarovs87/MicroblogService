const postService = require("../service/post-service");

class PostController {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.add = this.add.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
  }

  #createPostData(req) {
    return {
      userId: req.user.id,
      ...req.body,
    };
  }

  #extractPostId(req) {
    return req.body.postId;
  }

  async getAll(_req, res, next) {
    try {
      const data = await postService.getAll();
      res.send(data);
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const postId = this.#extractPostId(req);
      const data = await postService.getOne(postId);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }

  async add(req, res, next) {
    try {
      const newPostData = this.#createPostData(req);
      const data = await postService.add(newPostData);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }

  async edit(req, res, next) {
    try {
      const updatedPostData = this.#createPostData(req);
      const data = await postService.edit(updatedPostData);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      const postId = this.#extractPostId(req);
      const data = await postService.delete(postId);
      res.send(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new PostController();

require("dotenv").config();
const config = require("config");

const ApiError = require("../exceptions/api-errors");
const validationHelpers = require("../validation/helpers/validationHelpers");

const postService = require("../service/post-service");
const commentService = require("../service/comment-service");
const adminService = require("../service/admin-service");

class AdminController {
  constructor() {
    this.getAllUsers = this.getAllUsers.bind(this);
    this.removeUser = this.removeUser.bind(this);
    this.editUserRole = this.editUserRole.bind(this);
    this.removePost = this.removePost.bind(this);
    this.removeComment = this.removeComment.bind(this);
  }

  #validateParam(
    param,
    errorMessage = "Invalid parameter"
  ) {
    const validatedParam =
      validationHelpers.paramsWayNumberValidation(
        +param,
        errorMessage
      );
    if (validatedParam === undefined) {
      throw ApiError.BadRequest(errorMessage);
    }
    return validatedParam;
  }

  #validateRole(role) {
    if (!role) {
      throw ApiError.BadRequest("не задана новая роль", {
        newRole: "не задана новая роль",
      });
    }
    if (
      role !== config.role.adminRole &&
      role !== config.role.userRole
    ) {
      throw ApiError.BadRequest(
        `неправильная роль : ${config.role.adminRole} || ${config.role.userRole}`
      );
    }
  }

  async getAllUsers(_req, res, next) {
    try {
      const data = await adminService.getAllUsers();
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async removeUser(req, res, next) {
    try {
      const userId = this.#validateParam(
        req.params.userId,
        "некоректний userId"
      );
      const data = await adminService.deleteUser(userId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async editUserRole(req, res, next) {
    try {
      const userId = this.#validateParam(
        req.params.userId,
        "некоректний userId"
      );
      const newRole = req.body.newRole;

      this.#validateRole(newRole);

      const data = await adminService.editUserRole(
        userId,
        newRole
      );
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async removePost(req, res, next) {
    try {
      const postId = this.#validateParam(req.params.postId);
      const data = await postService.delete(postId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async removeComment(req, res, next) {
    try {
      const commentId = this.#validateParam(
        req.params.commentId,
        "некоректний commentId"
      );
      const data = await commentService.delete(commentId);
      res.json(data);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AdminController();

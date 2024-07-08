require("dotenv").config();
const config = require("config");

const adminService = require("../../service/admin-service");
const commentService = require("../../service/comment-service");
const postService = require("../../service/post-service");
const tokenService = require("../../service/token-service");
const marked = require("marked");

class PageRenderController {
  constructor() {
    this.renderHomePage = this.renderHomePage.bind(this);
    this.renderHomePageWithTag = this.renderHomePageWithTag.bind(this);
    this.renderRegistrationPage = this.renderRegistrationPage.bind(this);
    this.renderLoginPage = this.renderLoginPage.bind(this);
    this.renderMyAccountPage = this.renderMyAccountPage.bind(this);
    this.renderAdminPage = this.renderAdminPage.bind(this);
    this.renderAddNewPostPage = this.renderAddNewPostPage.bind(this);
    this.renderMyPostsPage = this.renderMyPostsPage.bind(this);
    this.renderEditPostPage = this.renderEditPostPage.bind(this);
    this.renderOnePost = this.renderOnePost.bind(this);
  }

  addAdditionallyInfo(req, _res, next) {
    try {
      req.additionally = {
        userData: tokenService.validateRefreshToken(req.cookies.refreshToken),
      };
      next();
      return;
    } catch (err) {
      next(err);
    }
  }

  async #renderPage(_req, res, next, renderPath, data = {}) {
    try {
      res.render(renderPath, data, (err, html) => {
        if (err) {
          return next(err);
        }
        res.send(html);
      });
    } catch (err) {
      next(err);
    }
  }

  async renderHomePage(req, res, next) {
    const { userData } = req.additionally;
    try {
      const posts = await postService.getAll();
      await this.#renderPage(req, res, next, "pages/home/index", {
        posts,
        userData,
      });
    } catch (err) {
      next(err);
    }
  }

  async renderHomePageWithTag(req, res, next) {
    const { userData } = req.additionally;
    const tag = req.params.tagName;
    try {
      const posts = await postService.getAllWithTag(tag);

      await this.#renderPage(req, res, next, "pages/home/index", {
        posts,
        userData,
        tag,
      });
    } catch (err) {
      next(err);
    }
  }

  renderNotFoundPage(req, res) {
    if (req.params.page === "404") {
      return res.status(404).render("pages/404");
    } else {
      return res.redirect("/404");
    }
  }

  renderErrorPage(err, req, res, next) {
    console.error(err);
    return res.status(500).render("pages/errorPage", { err });
  }

  renderRegistrationPage(req, res, next) {
    this.#renderPage(req, res, next, "pages/auth/registration/index");
  }

  renderLoginPage(req, res, next) {
    this.#renderPage(req, res, next, "pages/auth/login/index");
  }

  renderMyAccountPage(req, res, next) {
    const { userData } = req.additionally;
    this.#renderPage(req, res, next, "pages/auth/myAccount/index", {
      userData,
    });
  }

  async renderAdminPage(req, res, next) {
    const { userData } = req.additionally;
    const { role } = userData;
    if (role !== config.role.adminRole) {
      return res.redirect("/");
    }
    try {
      const usersData = await adminService.getAllUsers();
      const postsData = await postService.getAll();
      const commentsData = await commentService.getAll();
      await this.#renderPage(req, res, next, "pages/adminPage", {
        userData,
        usersData,
        postsData,
        commentsData,
      });
    } catch (err) {
      next(err);
    }
  }

  renderAddNewPostPage(req, res, next) {
    const { userData } = req.additionally;
    this.#renderPage(req, res, next, "pages/posts/editorPost/index", {
      userData,
    });
  }

  async renderMyPostsPage(req, res, next) {
    const { userData } = req.additionally;
    try {
      const postsData = await postService.getAllByUserId(userData.id);
      await this.#renderPage(req, res, next, "pages/posts/myPosts/index", {
        userData,
        postsData,
      });
    } catch (err) {
      next(err);
    }
  }

  async renderEditPostPage(req, res, next) {
    const { userData } = req.additionally;
    const postId = +req.params.postId;
    if (isNaN(postId)) {
      return res.render("pages/404");
    }
    try {
      const data = await postService.getOne(postId);
      if (data.userId !== userData.id) {
        return res.redirect("/");
      }
      await this.#renderPage(req, res, next, "pages/posts/editorPost/index", {
        userData,
        data,
      });
    } catch (err) {
      return res.render("pages/404");
    }
  }

  async renderOnePost(req, res, next) {
    const postId = +req.params.postId;
    if (isNaN(postId)) {
      return res.render("pages/404");
    }
    try {
      const data = await postService.getOne(postId);
      data.parsedMarkdown = marked.parse(data.markdownText);
      if (
        new Date(data.dateUpdate).getTime() ===
        new Date(data.dateCreate).getTime()
      ) {
        data.dateUpdate = null;
      }
      const { userData } = req.additionally;
      await this.#renderPage(req, res, next, "pages/posts/one/index", {
        data,
        userData,
      });
    } catch (err) {
      return res.render("pages/404");
    }
  }
}
module.exports = new PageRenderController();

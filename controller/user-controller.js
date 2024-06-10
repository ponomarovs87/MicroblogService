class UserController {
  async registration(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async login(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async logout(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async edit(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
  async refresh(req, res, next) {
    try {
      return res.json("success");
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

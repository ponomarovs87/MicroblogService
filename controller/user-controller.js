require("dotenv").config();
const config = require("config");

const ApiError = require("../exceptions/api-errors");
const userService = require("../service/user-service");
const tokenService = require("../service/token-service");
const clearCookieRefreshToken = require("../helper/clearCookieRefreshToken");

class UserController {
  constructor() {
    this.registration = this.registration.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.edit = this.edit.bind(this);
    this.delete = this.delete.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  async #checkExistingUser(email) {
    const existingUser = await userService.existingUser(
      email
    );
    if (existingUser) {
      throw ApiError.BadRequest(
        "Пользователь с таким адресом электронной почты уже существует",
        {
          email:
            ["Пользователь с таким адресом электронной почты уже существует"],
        },
        { email }
      );
    }
  }

  #checkRefreshToken(token) {
    if (!token || token === "") {
      throw ApiError.BadRequest("Выход уже выполнен");
    }
  }

  #validateUser(refreshToken, email) {
    const tokenData =
      tokenService.validateRefreshToken(refreshToken);
    if (email !== tokenData.email) {
      throw ApiError.Forbidden(
        `Зайдите под аккаунтом ${email}`,
        { email: [`Зайдите под аккаунтом ${email}`] }
      );
    }
  }

  async #checkForEmailConflict(email, newEmail) {
    if (newEmail && email !== newEmail) {
      await this.#checkExistingUser(newEmail);
    }
  }

  #setRefreshTokenCookie(res, token) {
    res.cookie("refreshToken", token, {
      maxAge: config.cookie.refreshTokenMaxAge,
      httpOnly: true,
    });
  }

  async registration(req, res, next) {
    try {
      await this.#checkExistingUser(req.body.email);
      const userData = await userService.registration(
        req.body
      );
      this.#setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      return res.status(201).json(userData);
    } catch (err) {
      next(err);
    }
  }

  async login(req, res, next) {
    try {
      const userData = await userService.login(req.body);
      this.#setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      return res.status(200).json(userData);
    } catch (err) {
      next(err);
    }
  }

  async logout(req, res, next) {
    try {
      this.#checkRefreshToken(req.cookies.refreshToken);
      const token = await userService.logout(
        req.cookies.refreshToken
      );
      clearCookieRefreshToken(res);
      res.json(token);
    } catch (err) {
      next(err);
    }
  }

  async edit(req, res, next) {
    try {
      this.#validateUser(
        req.cookies.refreshToken,
        req.body.email
      );
      await this.#checkForEmailConflict(
        req.body.email,
        req.body.newUserData.email
      );
      const userData = await userService.edit(req.body);
      this.#setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      this.#validateUser(
        req.cookies.refreshToken,
        req.body.email
      );
      const data = await userService.delete(req.body.email);
      clearCookieRefreshToken(res);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      const userData = await userService.refresh(
        res,
        refreshToken
      );
      this.#setRefreshTokenCookie(
        res,
        userData.refreshToken
      );
      return res.json(userData);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();

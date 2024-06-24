require("dotenv").config();
const config = require("config");

const express = require("express");
const routesPug = express.Router();
const axios = require("axios");

const formDataParser = express.urlencoded({
  extended: false,
});

routesPug.get("/", async (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;

    // Получаем данные из API
    const response = await axios.get(
      "http://localhost:3000/api/post/"
    );
    const posts = response.data;

    // Рендерим страницу и передаем данные в шаблон
    res.render("pages/home/index", { posts, accessToken });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
});

routesPug.get("/registrationPage", (_req, res) => {
  try {
    res.render("pages/auth/registration/index");
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
});

routesPug.post(
  "/registrationPage",
  formDataParser,
  async (req, res) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/registration",
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken, refreshToken } = response.data;

      res.cookie("refreshToken", refreshToken, {
        maxAge: config.cookie.refreshTokenMaxAge,
        httpOnly: true,
        secure: true,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: config.cookie.accessTokenMaxAge,
      });

      return res.redirect("/");
    } catch (err) {
      const { errors, reqData } = err.response.data;

      const formData = reqData;

      return res
        .status(err.response.status)
        .render("pages/auth/registration/index", {
          errors,
          formData,
        });
    }
  }
);

routesPug.get("/login", (_req, res) => {
  try {
    res.render("pages/auth/login/index");
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
});
routesPug.post(
  "/login",
  formDataParser,
  async (req, res) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/user/login",
        req.body,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const { accessToken, refreshToken } = response.data;

      res.cookie("refreshToken", refreshToken, {
        maxAge: config.cookie.refreshTokenMaxAge,
        httpOnly: true,
        secure: true,
      });

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: config.cookie.accessTokenMaxAge,
      });

      return res.redirect("/");
    } catch (err) {
      const { errors, reqData } = err.response.data;

      const formData = reqData;

      return res
        .status(err.response.status)
        .render("pages/auth/login/index", {
          errors,
          formData,
        });
    }
  }
);
// todo косяк надо удалять неактуальный токен
routesPug.get("/logout", async (req, res) => {
  try {
    // Создаем строку для заголовка Cookie
    const cookieHeader = Object.entries(req.cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join("; ");

    // Создаем экземпляр axios с включением credentials и установкой заголовка Cookie вручную
    const instance = axios.create({
      baseURL: "http://localhost:3000",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader, // Устанавливаем заголовок Cookie вручную
      },
    });

    // Отправляем POST запрос
    await instance.get("/api/user/logout");

    res.clearCookie("accessToken", { path: "/" });
    res.clearCookie("refreshToken", { path: "/" });

    return res.redirect("/");
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
});
routesPug.get("/myAccount", (req, res) => {
  try {
    const { accessToken, refreshToken } = req.cookies;
    res.render("pages/auth/myAccount/index", {
      accessToken,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).send("Error fetching posts");
  }
});
routesPug.post(
  "/myAccount",
  formDataParser,
  async (req, res) => {
    try {

      const request = {
        email: req.body.email,
        password: req.body.password,
        newUserData: {
          email: req.body.newUserEmail,
          password: req.body.newUserPassword,
          surname: req.body.newUserSurname,
          name: req.body.newUserName,
          birthDate: req.body.newUserBirthDate,
        },
      };

      const response = await axios.put(
        "http://localhost:3000/api/user/edit",
        request,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return res.redirect("/logout");
    } catch (err) {
      const { errors, reqData,message } = err.response.data;

      const formData = reqData;

      return res
        .status(err.response.status)
        .render("pages/auth/myAccount/index", {
          errors,
          formData,
          message
        });
    }
  }
);

//! временная заглушка Поменять!!!
routesPug.get("/:page", (req, res) => {
  if (req.params.page === "404") {
    return res.status(404).render("pages/404");
  }
  res.render(`pages/${req.params.page}`, (err, html) => {
    if (err) {
      return res.redirect("/404");
    }
    return res.send(html);
  });
});

module.exports = routesPug;

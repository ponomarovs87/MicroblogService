const express = require("express");
const routesPug = express.Router();
const axios = require("axios");

routesPug.get("/", async (_req, res) => {
    try {
      // Получаем данные из API
      const response = await axios.get("http://localhost:3000/api/post/");
      const posts = response.data;
  
      // Рендерим страницу и передаем данные в шаблон
      res.render("pages/home/home", { posts });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).send("Error fetching posts");
    }
  });

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

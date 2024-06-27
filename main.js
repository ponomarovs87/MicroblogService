require("dotenv").config();
const { server } = require("config");
const cookieParser = require("cookie-parser");
const express = require("express");

const routesApi = require("./routes/api/index");
const routesPug = require("./routes/pug/index");


const app = express();

app.use(express.json()); // подключение парсера json
app.use(cookieParser());
app.use("/api", routesApi);
app.set("view engine", "pug"); // подключение pug
app.use(express.static("static"));
app.use("/", routesPug);



app.listen(server.port, () => {
  console.log(
    `listening Server on ${server.host}:${server.port}`
  );
});

module.exports = app;

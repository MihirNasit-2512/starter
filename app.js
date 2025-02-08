var createError = require("http-errors");
var express = require("express");
var logger = require("morgan");
const router = require("./routes/index");
var app = express();
require("./helper/dbConnection").connect();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);


module.exports = app;

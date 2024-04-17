const express = require("express");
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();
require("dotenv").config();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());

// init db
require("./dbs/init.mongodb");
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

// init routes
app.get("/", (req, res, next) => {
    return res.status(200).json({
        msg: "alo anh Hoàng à!",
    });
});

// handling error

module.exports = app;

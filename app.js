require("dotenv").config();

const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const restrict = require("./middleware/restrict");

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const documentsRouter = require("./routes/documents");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/auth", restrict.auth, authRouter);
app.use("/documents", restrict.auth, documentsRouter);

module.exports = app;

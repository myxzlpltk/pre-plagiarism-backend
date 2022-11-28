require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const { connect } = require("mongoose");
const db = require("./config/keys").mongoURI;
const restrict = require("./middleware/restrict");
const subscriber = require("./services/subscriber");

connect(db)
  .then(() => console.log("MongoDB Connected"))
  .then(() => subscriber().then(() => console.log("Subscriber started...")))
  .catch((err) => console.log(err))

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const documentsRouter = require("./routes/documents");
const filesRouter = require("./routes/files");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", indexRouter);
app.use("/auth", restrict.auth, authRouter);
app.use("/documents", restrict.auth, documentsRouter);
app.use("/files", filesRouter);

module.exports = app;

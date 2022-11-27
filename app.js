require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const {connect} = require("mongoose");
const db = require("./config/keys").mongoURI;

console.log(db);

connect(db)
  .then(() => console.log("mongoDB Connected"))
  .catch((err) => console.log(err));

const indexRouter = require("./routes/index");
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const restrict = require("./middleware/restrict");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());

app.use(restrict.auth);

app.use("/", indexRouter);
app.use("/auth", authRouter);
app.use("/users", usersRouter);

module.exports = app;

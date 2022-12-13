const express = require("express");
const session = require("express-session");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const auth = require("./routes/auth");
const products = require("./routes/products");
const user = require("./routes/user");
const orders = require("./routes/orders");
global.__basedir = __dirname

const cors = require("cors");
require("dotenv").config();
const app = express();
app.use(cors());

mongoose
  .connect(process.env.mongoCreds, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("cool"))
  .catch(error => console.log(error));

const indexRouter = require("./routes/index");

app.use(passport.initialize());
app.use(logger("dev"));
app.use(express.json());
app.use(session({
  key:'userId',
  resave: false,
  saveUninitialized: false,
  secret: 'asd'
}))
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", auth);
app.use("/api/products", products);
app.use("/api/user", user);
app.use("/api/orders", orders);

app.use("/", indexRouter);

module.exports = app;

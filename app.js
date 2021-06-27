require("dotenv").config();

var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const errorMessages = require("./utils/errorMessages");

const usersRouter = require("./routes/users");
const obrasRouter = require("./routes/obras");
const proyectosRouter = require("./routes/proyectos");
const equipamientosRouter = require("./routes/equipamientos");
const documentacionRouter = require("./routes/documentacion");
const productosRouter = require("./routes/productos");

var app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/obras", obrasRouter);
app.use("/proyectos", proyectosRouter);
app.use("/equipamientos", equipamientosRouter);
app.use("/documentacion", documentacionRouter);
app.use("/productos", productosRouter);
app.use("/users", usersRouter);

//Token configuration
app.set("secretKey", process.env.JWT_SECRET_KEY);

const validateUser = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.status(401).json({ message: errorMessages.USERS.noToken });
  }
  jwt.verify(token, req.app.get("secretKey"), (err, decoded) => {
    if (err) {
      res.status(401).json({ message: errorMessages.USERS.tokenExpired });
    } else {
      req.body.tokenData = decoded;
      next();
    }
  });
};

app.validateUser = validateUser;

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Send json to client
  res.status(err.status || 500);
  // handle custom message for Validator (stripping "user validation failed: password")
  if (err instanceof mongoose.Document.ValidationError) {
    return res.status(500).json({ error: true, message: errorMessages.USERS.passwordIncorrect });
  }
  // anything else
  res.json({
    error: true,
    message: err.message,
  });
});

module.exports = app;

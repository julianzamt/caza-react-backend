const userModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const errorMessages = require("../utils/errorMessages");
const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = {
  create: async function (req, res, next) {
    console.log(req.body);
    if (!req.body.username || !req.body.password || !req.body.secretKey) {
      return res.status(400).json({
        error: true,
        message: errorMessages.USERS.allFieldsRequired,
      });
    } else if (req.body.secretKey !== process.env.ADMIN_SECRET_KEY) {
      return res.status(400).json({
        error: true,
        message: errorMessages.USERS.secretKey,
      });
    }
    try {
      const document = new userModel({
        username: req.body.username,
        password: req.body.password,
      });
      const response = await document.save();
      res.status(200).json(response);
    } catch (e) {
      next(e);
    }
  },
  update: async function (req, res, next) {},
  login: async function (req, res, next) {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        error: true,
        message: errorMessages.USERS.allFieldsRequired,
      });
    }
    try {
      const user = await userModel.findOne({ username: req.body.username });
      if (!user || !bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).json({ error: true, message: errorMessages.badUserOrPassword });
      }
      const token = jwt.sign({ userId: user._id }, req.app.get("secretKey"), { expiresIn: "1h" });
      res.status(200).json({ message: "Ok", token: token });
    } catch (e) {
      next(e);
    }
  },
};

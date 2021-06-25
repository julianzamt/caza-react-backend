const mongoose = require("../bin/mongodb");
const errorMessages = require("../utils/errorMessages");
const validators = require("../utils/validators");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, errorMessages.GENERAL.required], unique: true },
  password: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
    validate: {
      validator: v => validators.isGoodPassword(v),
      message: errorMessages.USERS.passwordIncorrect,
    },
  },
});

// Middleware
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

userSchema.post("save", function (err, doc, next) {
  if (err.name === "MongoError" && err.code === 11000) {
    next(new Error(errorMessages.USERS.usernameAlreadyTaken));
  } else {
    next(err);
  }
});

module.exports = mongoose.model("User", userSchema);

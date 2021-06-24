const mongoose = require("../bin/mongodb");
const errorMessages = require("../utils/errorMessages");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  username: { type: String, required: [true, errorMessages.GENERAL.required], unique: true },
  password: { type: String, required: [true, errorMessages.GENERAL.required] },
});

userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);

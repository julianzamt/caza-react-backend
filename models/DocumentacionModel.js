const mongoose = require("../bin/mongodb");
const errorMessages = require("../utils/errorMessages");
const { TEXT_LIMIT } = require("../utils/charLimits");

const ImageSchema = new mongoose.Schema({
  path: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
    unique: true,
  },
  originalName: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
  },
});

const DocumentacionSchema = new mongoose.Schema({
  text: { type: String, maxlength: [TEXT_LIMIT, errorMessages.GENERAL.maxlength] },
  images: [ImageSchema],
});

const Documentacion = mongoose.model("Documentacion", DocumentacionSchema);

module.exports = Documentacion;

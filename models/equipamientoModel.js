const mongoose = require("../bin/mongodb");
const errorMessages = require("../utils/errorMessages");
const { TEXT_LIMIT, TITLE_LIMIT, SUBTITLE_LIMIT } = require("../utils/charLimits");

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

const EquipamientoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, errorMessages.GENERAL.required],
    maxlength: [TITLE_LIMIT, errorMessages.GENERAL.maxlength],
    unique: true,
  },
  subtitle: { type: String, maxlength: [SUBTITLE_LIMIT, errorMessages.GENERAL.maxlength] },
  text: { type: String, maxlength: [TEXT_LIMIT, errorMessages.GENERAL.maxlength] },
  year: { type: Number, required: [true, errorMessages.GENERAL.required] },
  cover: [ImageSchema],
  images: [ImageSchema],
});

const Equipamiento = mongoose.model("Equipamiento", EquipamientoSchema);

module.exports = Equipamiento;

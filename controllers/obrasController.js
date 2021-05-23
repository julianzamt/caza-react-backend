const obraModel = require("../models/obraModel");

module.exports = {
  getAll: async function (req, res, next) {
    try {
      console.log("Hola");
      const obras = await obraModel.find();
      res.json(obras);
    } catch (e) {
      e.status = 400;
      next(e); // Generic error Handler in app.js
    }
  },
  create: async function (req, res, next) {
    try {
      const document = new obraModel({
        name: req.body.name,
        year: req.body.date,
        mainImage: req.body.mainImage,
        text: req.body.text,
        hidden: req.body.hidden,
      });
      const newObra = await document.save();
      res.json(newObra);
    } catch (e) {
      e.status = 400;
      next(e);
    }
  },
  getById: async function (req, res, next) {
    try {
      console.log(req.params);
      const obra = await obraModel.findById(req.params.id);
      res.json(obra);
    } catch (e) {
      e.status = 400;
      next(e);
    }
  },
  deleteById: async function (req, res, next) {
    try {
      const response = await obraModel.deleteOne({ _id: req.params.id });
      res.json(response);
    } catch (e) {
      e.status = 400;
      next(e);
    }
  },
  update: async function (req, res, next) {
    try {
      const response = await obraModel.updateOne(
        { _id: req.params.id },
        req.body
      );
      res.json(response);
    } catch (e) {
      e.status = 400;
      next(e);
    }
  },
};

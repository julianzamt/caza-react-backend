const equipamientoModel = require("../models/equipamientoModel");
const { uploadFile, getFileStream, deleteFile } = require("../utils/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const errorMessages = require("../utils/errorMessages");

module.exports = {
  getAll: async function (req, res, next) {
    try {
      const equipamientos = await equipamientoModel.find().sort({ index: 1 });
      res.status(200).json(equipamientos);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
  getById: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    try {
      const equipamiento = await equipamientoModel.findById(req.params.id);
      res.status(200).json(equipamiento);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
  getImageByKey: (req, res) => {
    if (req.params.key === "undefined") {
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    try {
      const key = req.params.key;
      const readStream = getFileStream(key);
      readStream.pipe(res);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.s3Error });
    }
  },
  create: async function (req, res, next) {
    const cover = req.files["cover"] ? req.files["cover"][0] : null;
    const images = req.files["images"];

    //upload images to s3, then erase from server
    try {
      if (cover) {
        await uploadFile(cover);
        await unlinkFile(cover.path);
      }
      if (images) {
        for (let image of images) {
          await uploadFile(image);
          await unlinkFile(image.path);
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.s3Error });
    }

    // If success, insert mongo record
    let coverArrayForMongo,
      imagesArrayForMongo = [];

    if (cover) {
      coverArrayForMongo = [
        {
          path: cover.filename,
          originalName: cover.originalname,
        },
      ];
    }
    if (images) {
      imagesArrayForMongo = images.map(image => {
        return {
          path: image.filename,
          originalName: image.originalname,
        };
      });
    }

    const document = new equipamientoModel({
      title: req.body.title,
      subtitle: req.body.subtitle,
      year: req.body.year,
      text: req.body.text,
      cover: coverArrayForMongo,
      images: imagesArrayForMongo,
    });

    try {
      const newEquipamiento = await document.save();
      res.status(200).json(newEquipamiento);
    } catch (e) {
      console.log(e);
      try {
        if (cover) {
          await deleteFile(cover.filename);
        }
        if (images) {
          for (image of images) {
            await deleteFile(image.filename);
          }
        }
      } catch (e) {
        console.log(e);
        return res.status(500).send({ error: true, message: errorMessages.GENERAL.s3Error });
      }
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
  updateCover: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    } else if (req.file === undefined) {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    const documentId = req.params.id;
    const cover = req.file;
    let documentToBeUpdated = "";
    try {
      documentToBeUpdated = await equipamientoModel.findById({ _id: documentId });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
    //Save new cover to S3 - Delete from server
    try {
      await uploadFile(cover);
      await unlinkFile(cover.path);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.s3Error });
    }
    // If success, update mongo document
    documentToBeUpdated.cover = {
      path: cover.filename,
      originalName: cover.originalname,
    };

    try {
      await equipamientoModel.updateOne({ _id: documentId }, documentToBeUpdated);
      let updatedEquipamiento = await equipamientoModel.findById({ _id: documentId });
      return res.status(200).json(updatedEquipamiento);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
  updateText: async function (req, res, next) {
    console.log(req);
    if (req.params.id === "undefined") {
      console.log("params");
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    } else if (!req.body) {
      console.log("body");
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    const documentId = req.params.id;
    let dataToBeUpdated = "";
    try {
      dataToBeUpdated = await equipamientoModel.findById({ _id: documentId });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }

    dataToBeUpdated.title = req.body.title;
    dataToBeUpdated.subtitle = req.body.subtitle;
    dataToBeUpdated.year = req.body.year;
    dataToBeUpdated.text = req.body.text;

    try {
      await equipamientoModel.updateOne({ _id: documentId }, dataToBeUpdated);
      let updatedEquipamiento = await equipamientoModel.findById({ _id: documentId });
      return res.status(200).json(updatedEquipamiento);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
  updateImages: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    } else if (req.files === undefined) {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    const images = req.files;
    const documentId = req.params.id;
    let documentToBeUpdated = "";
    try {
      documentToBeUpdated = await equipamientoModel.findById({ _id: documentId });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
    //Save new images to S3
    try {
      for (let image of images) {
        await uploadFile(image);
        await unlinkFile(image.path);
      }
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.s3Error });
    }
    // If success, insert mongo record
    for (let image of images) {
      const imageForMongo = {
        path: image.filename,
        originalName: image.originalname,
      };
      documentToBeUpdated.images.push(imageForMongo);
    }
    try {
      await equipamientoModel.updateOne({ _id: documentId }, documentToBeUpdated);
      let updatedEquipamiento = await equipamientoModel.findById({ _id: documentId });
      return res.status(200).json(updatedEquipamiento);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
  updateImagesOrder: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    } else if (!req.body) {
      console.log("body");
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    const documentId = req.params.id;
    const newImagesArray = req.body;
    let documentToBeUpdated = "";
    try {
      documentToBeUpdated = await equipamientoModel.findById({ _id: documentId });
      documentToBeUpdated.images = newImagesArray;
      await equipamientoModel.updateOne({ _id: documentId }, documentToBeUpdated);
      let updatedEquipamiento = await equipamientoModel.findById({ _id: documentId });
      return res.status(200).json(updatedEquipamiento);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
  deleteById: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    const id = req.params.id;
    try {
      const record = await equipamientoModel.findById({ _id: id });
      if (record.cover.length) await deleteFile(record.cover[0].path);
      if (record.images.length) {
        record.images.forEach(image => deleteFile(image.path));
      }
      const deleteStatus = await equipamientoModel.deleteOne({ _id: id });
      res.status(200).json(deleteStatus);
    } catch (e) {
      console.log(e);
      e.status = 400;
      res.json(e);
    }
  },
  deleteImageByKey: async function (req, res, next) {
    if (
      req.params.id === "undefined" ||
      req.query.section === "undefined" ||
      req.query.documentId === "undefined" ||
      req.query.imageId === "undefined"
    ) {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    const key = req.params.key;
    const documentId = req.query.documentId;
    const imageId = req.query.imageId;
    const coverFlag = req.query.coverFlag;
    let document = {};
    try {
      await deleteFile(key);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.s3Error });
    }
    try {
      document = await equipamientoModel.findById({ _id: documentId });
      if (coverFlag === "true") {
        await document.cover.id(imageId).remove();
      } else {
        await document.images.id(imageId).remove();
      }
      const updatedDocument = await document.save();
      res.status(200).json(updatedDocument);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
  updateIndex: async function (req, res, next) {
    if (req.params.id === "undefined") {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    } else if (!req.body) {
      return res.status(400).send({ error: true, message: errorMessages.GENERAL.badRequest });
    }
    const documentId = req.params.id;
    let dataToBeUpdated = "";
    try {
      dataToBeUpdated = await equipamientoModel.findById({ _id: documentId });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }

    dataToBeUpdated.index = req.body.index;

    try {
      await equipamientoModel.updateOne({ _id: documentId }, dataToBeUpdated);
      let updatedEquipamiento = await equipamientoModel.findById({ _id: documentId });
      return res.status(200).json(updatedEquipamiento);
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }
  },
};

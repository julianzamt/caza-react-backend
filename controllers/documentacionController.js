const documentacionModel = require("../models/documentacionModel");
const { uploadFile, getFileStream, deleteFile } = require("../utils/s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const errorMessages = require("../utils/errorMessages");

module.exports = {
  getAll: async function (req, res, next) {
    try {
      const documentacion = await documentacionModel.find();
      res.status(200).json(documentacion);
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
    const images = req.files;
    //upload images to s3, then erase from server
    try {
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
    let imagesArrayForMongo = [];

    if (images) {
      imagesArrayForMongo = images.map(image => {
        return {
          path: image.filename,
          originalName: image.originalname,
        };
      });
    }

    const document = new documentacionModel({
      title: req.body.title,
      text: req.body.text,
      images: imagesArrayForMongo,
    });

    try {
      const newDocumentacion = await document.save();
      res.status(200).json(newDocumentacion);
    } catch (e) {
      console.log(e);
      try {
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
      dataToBeUpdated = await documentacionModel.findById({ _id: documentId });
    } catch (e) {
      console.log(e);
      return res.status(500).send({ error: true, message: errorMessages.GENERAL.dbError });
    }

    dataToBeUpdated.title = req.body.title;
    dataToBeUpdated.text = req.body.text;

    try {
      await documentacionModel.updateOne({ _id: documentId }, dataToBeUpdated);
      let updatedDocumentacion = await documentacionModel.findById({ _id: documentId });
      return res.status(200).json(updatedDocumentacion);
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
      documentToBeUpdated = await documentacionModel.findById({ _id: documentId });
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
      await documentacionModel.updateOne({ _id: documentId }, documentToBeUpdated);
      let updatedDocumentacion = await documentacionModel.findById({ _id: documentId });
      return res.status(200).json(updatedDocumentacion);
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
      documentToBeUpdated = await documentacionModel.findById({ _id: documentId });
      documentToBeUpdated.images = newImagesArray;
      await documentacionModel.updateOne({ _id: documentId }, documentToBeUpdated);
      let updatedDocumentacion = await documentacionModel.findById({ _id: documentId });
      return res.status(200).json(updatedDocumentacion);
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
      const record = await documentacionModel.findById({ _id: id });
      if (record.images.length) {
        record.images.forEach(image => deleteFile(image.path));
      }
      const deleteStatus = await documentacionModel.deleteOne({ _id: id });
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
      document = await documentacionModel.findById({ _id: documentId });
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
};

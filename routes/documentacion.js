const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./uploads" });

const {
  getAll,
  getImageByKey,
  create,
  updateImagesOrder,
  deleteImageByKey,
  deleteById,
  updateText,
  updateImages,
} = require("../controllers/documentacionController");

router.get("/", getAll);
router.get("/images/:key", getImageByKey);
router.post("/", (req, res, next) => req.app.validateUser(req, res, next), upload.array("images"), create);
router.delete("/images/:key", (req, res, next) => req.app.validateUser(req, res, next), deleteImageByKey);
router.delete("/:id", (req, res, next) => req.app.validateUser(req, res, next), deleteById);
router.put("/:id/update-text", (req, res, next) => req.app.validateUser(req, res, next), updateText);
router.put("/:id/update-images", (req, res, next) => req.app.validateUser(req, res, next), upload.array("images"), updateImages);
router.put("/:id/update-order", (req, res, next) => req.app.validateUser(req, res, next), updateImagesOrder);

module.exports = router;

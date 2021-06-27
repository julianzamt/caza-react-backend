const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./uploads" });

const {
  getAll,
  getById,
  getImageByKey,
  create,
  updateOrder,
  deleteImageByKey,
  deleteById,
  updateCover,
  updateText,
  updateImages,
} = require("../controllers/productosController");

router.get("/", getAll);
router.get("/:id", getById);
router.get("/images/:key", getImageByKey);
router.post(
  "/",
  (req, res, next) => req.app.validateUser(req, res, next),
  upload.fields([{ name: "images" }, { name: "cover", maxCount: 1 }]),
  create
);
router.delete("/images/:key", (req, res, next) => req.app.validateUser(req, res, next), deleteImageByKey);
router.delete("/:id", (req, res, next) => req.app.validateUser(req, res, next), deleteById);
router.put("/:id/update-cover", (req, res, next) => req.app.validateUser(req, res, next), upload.single("cover"), updateCover);
router.put("/:id/update-text", (req, res, next) => req.app.validateUser(req, res, next), updateText);
router.put("/:id/update-images", (req, res, next) => req.app.validateUser(req, res, next), upload.array("images"), updateImages);
router.put("/:id/update-order", (req, res, next) => req.app.validateUser(req, res, next), updateOrder);

module.exports = router;

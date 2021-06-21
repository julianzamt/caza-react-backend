const express = require("express");
const router = express.Router();

const multer = require("multer");
const upload = multer({ dest: "./uploads" });

const {
  getAll,
  getImageByKey,
  create,
  updateOrder,
  deleteImageByKey,
  deleteById,
  updateText,
  updateImages,
} = require("../controllers/documentacionController");

router.get("/", getAll);
router.get("/images/:key", getImageByKey);
router.post("/", upload.array("images"), create);
router.delete("/images/:key", deleteImageByKey);
router.delete("/:id", deleteById);
router.put("/:id/update-text", updateText);
router.put("/:id/update-images", upload.array("images"), updateImages);
router.put("/:id/update-order", updateOrder);

module.exports = router;

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
} = require("../controllers/equipamientosController");

router.get("/", getAll);
router.get("/:id", getById);
router.get("/images/:key", getImageByKey);
router.post("/", upload.fields([{ name: "images" }, { name: "cover", maxCount: 1 }]), create);
router.delete("/images/:key", deleteImageByKey);
router.delete("/:id", deleteById);
router.put("/:id/update-cover", upload.single("cover"), updateCover);
router.put("/:id/update-text", updateText);
router.put("/:id/update-images", upload.array("images"), updateImages);
router.put("/:id/update-order", updateOrder);

module.exports = router;

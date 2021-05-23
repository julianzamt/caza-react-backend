var express = require("express");
var router = express.Router();
const {
  getAll,
  create,
  getById,
  deleteById,
  update,
} = require("../controllers/obrasController");

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);
router.delete("/:id", deleteById);
router.post("/:id", update);

module.exports = router;

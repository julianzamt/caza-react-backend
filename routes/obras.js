var express = require("express");
var router = express.Router();
const { getAll, create, getById } = require("../controllers/obrasController");

router.post("/", create);
router.get("/", getAll);
router.get("/:id", getById);

module.exports = router;

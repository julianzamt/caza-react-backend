var express = require("express");
var router = express.Router();
const { login, create, update } = require("../controllers/userController");

router.post("/", login);
router.post("/register", create);
router.put("/update", update);

module.exports = router;

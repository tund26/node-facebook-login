const router = require("express").Router();

const { isValidRequest, authenticate, getSingleById, logout } = require("../controllers/accountController");

router.get("/:id", isValidRequest, getSingleById);
router.post("/authenticate", authenticate);
router.post("/logout", isValidRequest, logout);

module.exports = router;
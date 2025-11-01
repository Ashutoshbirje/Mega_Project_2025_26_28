const express = require("express");
const { register, login, refreshToken, logout } = require("../controllers/authController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", auth, logout);

module.exports = router;

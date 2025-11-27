const express = require("express");
const { register, login, refreshToken, logout } = require("../controllers/authController");
const { auth } = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refreshToken);
router.post("/logout", auth, logout);

// ---- NEW: get current user using auth middleware ----
router.get("/me", auth, (req, res) => {
  // auth middleware sets req.user (with password excluded already)
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  return res.json({ user: req.user });
});

module.exports = router;

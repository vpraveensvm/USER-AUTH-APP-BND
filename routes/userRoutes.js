const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  handleRefreshToken,
  handleLogout,
} = require("../controllers/userController");
const validateToken = require("../middlewares/ValidateToken");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/refresh", handleRefreshToken);
router.get("/logout", handleLogout);
router.get("/current", validateToken, currentUser);

module.exports = router;

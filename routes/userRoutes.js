const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  handleRefreshToken,
  handleLogout,
  getAllUsers,
} = require("../controllers/userController");
const validateToken = require("../middlewares/ValidateToken");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/refresh", handleRefreshToken);
router.get("/logout", handleLogout);
router.get("/current", validateToken, currentUser);
router.get("/", validateToken, getAllUsers);

module.exports = router;

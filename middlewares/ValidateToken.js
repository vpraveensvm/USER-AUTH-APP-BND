const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header not found" });
  }

  if (authHeader.startsWith("Bearer")) {
    const authToken = authHeader.split(" ")[1];
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Failed to validate token" });
      } else {
        req.user = decoded.user.userName;
        req.roles = decoded.user.roles;
        next();
      }
    });
  }
});

module.exports = validateToken;

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  console.log("validateToken");
  const authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader) {
    res.sendStatus(401);
    throw new Error("Authorization header not found");
  }

  if (authHeader.startsWith("Bearer")) {
    const authToken = authHeader.split(" ")[1];
    jwt.verify(authToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(401);
        throw new Error(err);
      } else {
        console.log(decoded);

        req.user = decoded.user.userName;
        req.roles = decoded.user.roles;
        next();
      }
    });
  }
});

module.exports = validateToken;

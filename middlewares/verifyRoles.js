const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles)
      return res.status(401).json({ message: "No roles found in request" });
    const rolesArray = [...allowedRoles];

    const result = req.roles.some((role) => rolesArray.includes(role));
    if (!result) res.status(401).json({ message: "Not Authorized" });
    next();
  };
};

module.exports = verifyRoles;

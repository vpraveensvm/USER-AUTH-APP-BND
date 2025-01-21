const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);
    const rolesArray = [...allowedRoles];
    // rolesaraaya = admin
    // req = user, admin
    const result = req.roles.some((role) => rolesArray.includes(role));
    if (!result) return res.sendStatus(401);
    next();
  };
};

module.exports = verifyRoles;

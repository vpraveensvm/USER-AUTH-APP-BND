const express = require("express");
const router = express.Router();
const {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const verifyRoles = require("../middlewares/verifyRoles");
const ROLES_LIST = require("../config/roles");

const validateToken = require("../middlewares/ValidateToken");

router
  .route("/")
  .get(getContacts)
  .post(validateToken, verifyRoles(ROLES_LIST.Admin), createContact);

router
  .route("/:id")
  .get(getContact)
  .put(validateToken, verifyRoles(ROLES_LIST.Admin), updateContact)
  .delete(validateToken, verifyRoles(ROLES_LIST.Admin), deleteContact);

module.exports = router;

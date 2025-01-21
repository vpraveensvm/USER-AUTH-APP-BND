const mongoose = require("mongoose");

const userModel = mongoose.Schema(
  {
    userName: {
      type: String,
      required: [true, "Username is missing"],
      unique: [true, "Username is already taken"],
    },
    password: {
      type: String,
      required: [true, "Password is missing"],
    },
    refreshToken: { type: String },
    roles: { type: Object, default: { User: 102 }, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("user", userModel);

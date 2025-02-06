const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) return res.status(204).json({ message: "No users found" });
  res.json(users);
};

const registerUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are mandatory!" });
  }

  const userAvailable = await User.findOne({ userName });

  if (userAvailable) {
    return res.status(400).json({ message: "User exists with this Username!" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    userName,
    password: hashedPassword,
    roles: { User: 102 },
  });

  if (user) {
    res.status(201).json({ _id: user.id, userName: user.userName });
  } else {
    return res.status(400).json({ message: "User creation failed" });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  if (!userName || !password) {
    return res.status(400).json({ message: "All fields are mandatory" });
  }

  const user = await User.findOne({ userName });
  if (user && (await bcrypt.compare(password, user.password))) {
    const userRoles = Object.values(user.roles);
    const accessToken = jwt.sign(
      {
        user: {
          userName: user.userName,
          roles: userRoles,
        },
        id: user.id,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );

    const refreshToken = jwt.sign(
      {
        user: {
          userName: user.userName,
          id: user.id,
        },
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1m" }
    );

    //store refresh token in db
    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      // maxAge: 24 * 60 * 60 * 1000,
      maxAge: 1 * 60 * 1000,
      secure: false, //secure true will block the cookie in http
      sameSite: "Lax", // Required for cross-site cookies
    });

    res.status(201).json({ accessToken: accessToken, roles: userRoles });
  } else {
    res.status(401).json("Username or Password is not correct");
  }
});

const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    return res.status(401).json({ message: "No refresh token found" });
  }
  const refreshToken = cookies.refreshToken;
  const foundUser = await User.findOne({ refreshToken });

  if (foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err)
          return res.status(401).json({ message: "All fields are mandatory" });

        const userRoles = Object.values(foundUser.roles);

        const accessToken = jwt.sign(
          {
            user: {
              userName: decoded.userName,
              roles: userRoles,
            },
            id: decoded.id,
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "30s" }
        );

        res.json({ accessToken, roles: userRoles });
      }
    );
  } else {
    return res
      .status(401)
      .json({ message: "User not found with this refresh token." });
  }
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.refreshToken)
    return res.status(204).json({ message: "Refresh token not found" }); //No content
  const refreshToken = cookies.refreshToken;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken });

  if (!foundUser) {
    // sameSite: "None", secure: true - add this for production(https)
    res.clearCookie("refreshToken", { httpOnly: true });
    return res
      .status(204)
      .json({ message: "User not found with this refresh token" });
  }

  await User.updateOne({ _id: foundUser._id }, { refreshToken: "" });

  // sameSite: "None", secure: true - add this for production(https)
  res.clearCookie("refreshToken", { httpOnly: true });
  return res.status(204).json({ message: "Logged out succeffully" });
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  handleRefreshToken,
  handleLogout,
};

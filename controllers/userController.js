const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../model/userModel");

const registerUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  console.log(req.body);
  if (!userName || !password) {
    res.sendStatus(400);
    throw new Error("All fields are mandatory");
  }

  const userAvailable = await User.findOne({ userName });
  console.log("userAvailable", userAvailable);

  if (userAvailable) {
    res.sendStatus(400);
    throw new Error("User exist with this Username!");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    userName,
    password: hashedPassword,
    roles: { User: 102 },
  });

  if (user) {
    console.log("User created", user);
    res.status(201).json({ _id: user.id, userName: user.userName });
  } else {
    res.sendStatus(400);
    console.log("User creation failed");
    throw new Error("User registration failed!");
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { userName, password } = req.body;
  console.log("username", userName);
  console.log("password", password);
  if (!userName || !password) {
    res.sendStatus(400);
    throw new Error("All fields are mandatory");
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
      { expiresIn: "1d" }
    );

    //store refresh token in db

    user.refreshToken = refreshToken;
    await user.save();

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(201).json({ accessToken: accessToken, roles: userRoles });
  } else {
    res.status(401).json("Username or Password is not correct");
  }
});

const currentUser = asyncHandler(async (req, res) => {
  console.log("current");
  console.log("User data from authtoken", req.user);
  console.log("User data from authtoken", req.roles);
  res.status(201).json(req.user);
});

const handleRefreshToken = async (req, res) => {
  console.log("handleRefreshToken controller");
  const cookies = req.cookies;
  if (!cookies?.refreshToken) {
    res.sendStatus(401);
  }
  console.log(cookies, "cookies");

  const refreshToken = cookies.refreshToken;

  const foundUser = await User.findOne({ refreshToken });

  if (foundUser) {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(401);

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
          { expiresIn: "2m" }
        );

        res.json({ accessToken });
      }
    );
  } else {
    res.sendStatus(401);
    throw new Error(err);
  }
};

const handleLogout = async (req, res) => {
  // On client, also delete the accessToken

  const cookies = req.cookies;
  console.log("cookies", cookies);

  if (!cookies?.refreshToken) return res.sendStatus(204); //No content
  const refreshToken = cookies.refreshToken;

  // Is refreshToken in db?
  const foundUser = await User.findOne({ refreshToken });

  console.log("foundUser", foundUser);

  if (!foundUser) {
    // sameSite: "None", secure: true - add this for production(https)
    res.clearCookie("refreshToken", { httpOnly: true });
    return res.sendStatus(204);
  }

  await User.updateOne({ _id: foundUser._id }, { refreshToken: "" });

  // sameSite: "None", secure: true - add this for production(https)
  res.clearCookie("refreshToken", { httpOnly: true });
  res.sendStatus(204);
};

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  handleRefreshToken,
  handleLogout,
};

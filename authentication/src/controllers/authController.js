const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/config");
const sessionModel = require("../models/session.model");
const crypto = require("crypto");

async function registerUser(req, res) {
  const { username, email, password } = req.body;

  const isUserAlreadyExists = await userModel.findOne({ email: email });

  if (isUserAlreadyExists) {
    return res.status(409).json({
      message: "user already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    username: username,
    email: email,
    password: hashedPassword,
  });

  const refreshToken = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" },
  );

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.create({
    user: user._id,
    refreshTokenHash,
    ip: req.ip,
    userAgent: req.headers["user-agent"],
  });

  const accessToken = jwt.sign(
    {
      id: user._id,
      sessionId: session._id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "15m" },
  );

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 1000, // 7 din
  });

  res.status(201).json({
    message: "user registered successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    accessToken,
  });
}

async function getMeUser(req, res) {
  //token ko read karke user ki details send karega

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Token not found",
    });
  }

  const decoded = await jwt.verify(token, config.JWT_SECRET_KEY);

  const user = await userModel.findById(decoded.id);

  res.status(200).json({
    message: "User Fetched successfully",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

async function refreshToken(req, res) {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      message: "Token not Found",
    });
  }
  const decoded = await jwt.verify(refreshToken, config.JWT_SECRET_KEY);
  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(401).json({
      message: "Invalid refresh token",
    });
  }

  const accessToken = jwt.sign(
    {
      id: decoded.id,
      sessionId: session._id,
    },
    config.JWT_SECRET_KEY,
    {
      expiresIn: "15m",
    },
  );

  const newRefreshToken = jwt.sign(
    {
      id: decoded.id,
    },
    config.JWT_SECRET_KEY,
    {
      expiresIn: "7d",
    },
  );

  const newRefreshTokenHash = crypto
    .createHash("sha256")
    .update(newRefreshToken)
    .digest("hex");

  session.refreshTokenHash = newRefreshTokenHash;
  await session.save();

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 1000, // 7 din
  });

  res.status(200).json({
    message: "accessToken refreshed successfully",
    accessToken,
  });
}

async function logOut(req, res) {
  const refreshToken = req.cookies.refreshToken
  if (!refreshToken) {
    return res.status(400).json({
      message: "Refresh Token not found",
    });
  }

  const refreshTokenHash = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex");

  const session = await sessionModel.findOne({
    refreshTokenHash,
    revoked: false,
  });

  if (!session) {
    return res.status(400).json({
      message: "Invalid Refresh Token",
    });
  }

  session.revoked = true;
  await session.save();
  res.clearCookie("refreshToken");

  res.status(200).json({
    message: "Logged Out successfully",
  });
}

module.exports = { registerUser, getMeUser, refreshToken, logOut };

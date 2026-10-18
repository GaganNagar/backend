const mongoose = require("mongoose");
const { refreshToken } = require("../controllers/authController");

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: [true, "User is required"],
    },
    refreshTokenHash: {
      type: String,
      required: [true, "Refresh Token hash is required"],
    },
    ip: {
      type: String,
      required: [true, "IP Address is required"],
    },
    userAgent: {
      type: String,
      required: [true, "UserAgent is required"],
    },
    revoked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const sessionModel = mongoose.model("sessions", sessionSchema);

module.exports = sessionModel;

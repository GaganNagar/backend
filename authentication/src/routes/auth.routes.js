const express = require('express');
const router = express.Router();
const authController = require("../controllers/authController")


router.post("/register",authController.registerUser)
router.get("/get-me",authController.getMeUser)
router.get("/refresh-token",authController.refreshToken)

module.exports = router
const express = require("express");
const router = express.Router();

const { SignupUser, LoginUser, ForgotPassword, UpdateProfile, GetProfile, GetAllUsers } = require("../Controllers/UserController");

// POST /api/user/signup
router.post("/signup", SignupUser);

// POST /api/user/login
router.post("/login", LoginUser);

// POST /api/user/forgot-password
router.post("/forgot-password", ForgotPassword);

// PUT /api/user/update-profile
router.put("/update-profile", UpdateProfile);

// GET /api/user/profile/:email
router.get("/profile/:email", GetProfile);

// GET /api/user/all
router.get("/all", GetAllUsers);

module.exports = router;

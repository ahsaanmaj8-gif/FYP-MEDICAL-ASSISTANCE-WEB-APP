const express = require("express");
const { register, login, getProfile } = require("../Controllers/authController");
const { requireSignIn } = require("../middleware/authMiddleware");
const cloudinaryFileUploader = require("../middleware/fileuploader.js");



const router = express.Router();


router.post("/register", cloudinaryFileUploader.single("profilePicture"), register);

router.post("/login", login);


// router.get("/profile", requireSignIn, getProfile);

module.exports = router;
import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

// ✅ NEW IMPORT (STEP 7)
import upload from "../middleware/upload.js";

const router = express.Router();


/* -----------------------------------------
   GET LOGGED-IN USER PROFILE
----------------------------------------- */

router.get("/me", protect, async (req, res) => {

  try {

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({ message: "Error fetching profile" });

  }

});


/* -----------------------------------------
   UPDATE PROFILE
----------------------------------------- */

router.put("/profile", protect, async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fullName = req.body.name || req.body.fullName || user.fullName;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    user.studentId = req.body.studentId || user.studentId;
    user.program = req.body.program || user.program;
    user.specialization = req.body.specialization || user.specialization;
    user.bio = req.body.bio || user.bio;
    user.location = req.body.location || user.location;
    user.yearsOfExperience = req.body.yearsOfExperience !== undefined ? req.body.yearsOfExperience : user.yearsOfExperience;

    if (req.body.notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...req.body.notificationPreferences
      };
    }

    const updatedUser = await user.save();

    res.json(updatedUser);

  } catch (error) {

    res.status(500).json({ message: "Error updating profile" });

  }

});


/* -----------------------------------------
   ✅ STEP 7: UPLOAD PROFILE IMAGE (ADDED ONLY)
----------------------------------------- */

router.post(
  "/upload-profile",
  protect,
  (req, res, next) => {
    upload.single("image")(req, res, (err) => {
      if (err) {
        console.error("Multer/Cloudinary Error:", err);
        return res.status(400).json({ message: "Upload failed at storage", error: err.message });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      console.log("File uploaded to Cloudinary. Info:", req.file);

      if (!req.file) {
        console.error("No file received after Cloudinary upload");
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Save Cloudinary image URL (path is the URL for Cloudinary storage)
      user.profilePic = req.file.path;

      await user.save();

      res.json({
        success: true,
        image: req.file.path,
      });

    } catch (error) {
      console.error("Database save error after upload:", error);
      res.status(500).json({ message: "Failed to save profile picture to database", error: error.message });
    }
  }
);


/* -----------------------------------------
   UPDATE SETTINGS
----------------------------------------- */

router.put("/settings", protect, async (req, res) => {

  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.body.settings) {
      user.settings = {
        ...user.settings,
        ...req.body.settings,
        accessibility: {
          ...user.settings.accessibility,
          ...req.body.settings.accessibility
        }
      };
    }

    const updatedUser = await user.save();

    res.json(updatedUser);

  } catch (error) {

    res.status(500).json({ message: "Error updating settings" });

  }

});


export default router;
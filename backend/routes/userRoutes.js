import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

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

export default router;
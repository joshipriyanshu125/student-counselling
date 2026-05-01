import express from "express";
import User from "../models/User.js";

const router = express.Router();

// get pending counsellors
router.get("/pending-counsellors", async (req, res) => {
    try {
        const pending = await User.find({ role: "counsellor", isApproved: false })
            .select("fullName email specialization phone profilePic createdAt");
        res.json({ success: true, data: pending });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// approve counsellor
router.put("/approve/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isApproved: true },
            { new: true }
        );

        res.json({
            success: true,
            message: "Counsellor approved",
            data: user
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// reject/delete counsellor
router.delete("/reject/:id", async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Counsellor registration rejected" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
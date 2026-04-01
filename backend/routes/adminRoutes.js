import express from "express";
import User from "../models/User.js";

const router = express.Router();

// approve counsellor
router.put("/approve/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { returnDocument: "after" }
    );

    res.json({
        success: true,
        message: "Counsellor approved",
        data: user
    });
});

export default router;
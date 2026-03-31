import express from "express";
import {
    protect,
    allowStudent,
    allowCounsellor,
    allowAdmin,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/student", protect, allowStudent, (req, res) => {
    res.json({ message: "Welcome Student 🎓" });
});

router.get("/counsellor", protect, allowCounsellor, (req, res) => {
    res.json({ message: "Welcome Counsellor 🧑‍⚕️" });
});

router.get("/admin", protect, allowAdmin, (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
});

export default router;
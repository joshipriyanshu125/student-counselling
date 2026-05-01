import express from "express";
import { logMood, getMoodStats, getTodayMood } from "../controllers/moodController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, logMood);
router.get("/stats", protect, getMoodStats);
router.get("/today", protect, getTodayMood);

export default router;

import express from "express";

import {
    createFeedback,
    getCounsellorFeedback,
    getStudentFeedback,
    getSessionFeedback,
} from "../controllers/feedbackController.js";

import {
    protect,
    allowStudent,
    allowCounsellor,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/feedback", protect, allowStudent, createFeedback);

router.get("/feedback/student", protect, allowStudent, getStudentFeedback);

router.get("/feedback/my", protect, allowCounsellor, getCounsellorFeedback);

router.get("/feedback/session/:sessionId", protect, getSessionFeedback);

export default router;
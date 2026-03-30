const express = require("express");
const router = express.Router();

const {
    createFeedback,
    getCounsellorFeedback,
    getStudentFeedback,
    getSessionFeedback,
} = require("../controllers/feedbackController");

const {
    protect,
    allowStudent,
    allowCounsellor,
} = require("../middleware/authMiddleware");

// Student submits feedback for a session
router.post("/feedback", protect, allowStudent, createFeedback);

// Student views all feedback they have left
router.get("/feedback/student", protect, allowStudent, getStudentFeedback);

// Counsellor views all feedback left for their sessions
router.get("/feedback/my", protect, allowCounsellor, getCounsellorFeedback);

// Student/Counsellor views feedback for a specific session
router.get("/feedback/session/:sessionId", protect, getSessionFeedback);

module.exports = router;
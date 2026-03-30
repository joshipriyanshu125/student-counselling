const express = require("express");
const router = express.Router();

const {
    createSession,
    getStudentSessions,
    getCounsellorSessions,
    getSessionById,
} = require("../controllers/sessionController");

const {
    protect,
    allowCounsellor,
} = require("../middleware/authMiddleware");



router.post(
    "/sessions",
    protect,
    allowCounsellor,
    createSession
);

router.get(
    "/sessions/my",
    protect,
    allowCounsellor,
    getCounsellorSessions
);

router.get(
    "/sessions/student",
    protect,
    getStudentSessions
);

router.get(
    "/sessions/:id",
    protect,
    getSessionById
);

module.exports = router;
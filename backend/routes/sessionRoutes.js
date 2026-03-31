import express from "express";

import {
    createSession,
    getStudentSessions,
    getCounsellorSessions,
    getSessionById,
} from "../controllers/sessionController.js";

import {
    protect,
    allowCounsellor,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/sessions", protect, allowCounsellor, createSession);

router.get("/sessions/my", protect, allowCounsellor, getCounsellorSessions);

router.get("/sessions/student", protect, getStudentSessions);

router.get("/sessions/:id", protect, getSessionById);

export default router;
import express from "express";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    getUnreadCount
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/unread-count", protect, getUnreadCount);
router.get("/", protect, getNotifications);

router.patch("/read-all", protect, markAllNotificationsRead);
router.patch("/:id/read", protect, markNotificationRead);

export default router;
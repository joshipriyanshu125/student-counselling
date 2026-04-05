import express from "express";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    getUnreadCount
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/notifications/unread-count", protect, getUnreadCount);
router.get("/notifications", protect, getNotifications);

router.patch("/notifications/read-all", protect, markAllNotificationsRead);
router.patch("/notifications/:id/read", protect, markNotificationRead);

export default router;
import express from "express";

import {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    getUnreadCount,
    deleteNotification
} from "../controllers/notificationController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/notifications/unread-count", protect, getUnreadCount);
router.get("/notifications", protect, getNotifications);

router.patch("/notifications/read-all", protect, markAllNotificationsRead);
router.patch("/notifications/:id/read", protect, markNotificationRead);
router.delete("/notifications/:id", protect, deleteNotification);

export default router;
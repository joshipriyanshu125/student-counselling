const express = require("express");
const router = express.Router();

const {
    getNotifications,
    markNotificationRead,
    markAllNotificationsRead
} = require("../controllers/notificationController");

const { protect } = require("../middleware/authMiddleware");

router.get("/notifications", protect, getNotifications);

router.patch("/notifications/read-all", protect, markAllNotificationsRead);
router.patch("/notifications/:id/read", protect, markNotificationRead);

module.exports = router;    
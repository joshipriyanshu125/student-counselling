import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMessages, getConversations, markAsRead, getTotalUnreadCount } from "../controllers/messageController.js";

const router = express.Router();

// Get total unread message count
router.get("/unread-count", protect, getTotalUnreadCount);

// Get all conversations list
router.get("/conversations/all", protect, getConversations);

// Get history for a specific room
router.get("/:roomId", protect, getMessages);

// Mark as read
router.patch("/read/:roomId", protect, markAsRead);



export default router;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMessages, getConversations, markAsRead } from "../controllers/messageController.js";

const router = express.Router();

// Get history for a specific room
router.get("/:roomId", protect, getMessages);

// Get all conversations list
router.get("/conversations/all", protect, getConversations);

// Mark as read
router.patch("/read/:roomId", protect, markAsRead);

export default router;
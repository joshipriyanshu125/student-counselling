import Message from "../models/Message.js";
import User from "../models/User.js";

// @desc    Get messages for a specific room
// @route   GET /api/messages/:roomId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { roomId } = req.params;
    const messages = await Message.find({ roomId })
      .sort({ createdAt: 1 })
      .populate("senderId", "fullName email role")
      .populate("receiverId", "fullName email role");

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching messages",
      error: error.message,
    });
  }
};

// @desc    Get list of conversations for the current user
// @route   GET /api/messages/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find all unique users the current user has chatted with
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .lean();

    const conversationPartners = new Set();
    const conversations = [];

    for (const msg of messages) {
      const partnerId = msg.senderId.toString() === userId.toString() 
        ? msg.receiverId 
        : msg.senderId;

      if (!conversationPartners.has(partnerId.toString())) {
        conversationPartners.add(partnerId.toString());
        
        const partner = await User.findById(partnerId).select("fullName email role specialization bio");
        
        conversations.push({
          partner,
          lastMessage: msg.message,
          lastMessageTime: msg.createdAt,
          roomId: msg.roomId,
          unreadCount: 0, // Placeholder
        });
      }
    }

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching conversations",
      error: error.message,
    });
  }
};

// @desc    Mark messages in a room as read
// @route   PATCH /api/messages/read/:roomId
// @access  Private
export const markAsRead = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      { roomId, receiverId: userId, isRead: false },
      { $set: { isRead: true } }
    );

    res.status(200).json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error marking messages as read",
      error: error.message,
    });
  }
};

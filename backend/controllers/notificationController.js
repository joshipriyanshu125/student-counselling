import Notification from "../models/Notification.js";

// GET USER NOTIFICATIONS
export const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const notifications = await Notification.find({ user: userId })
            .populate("appointmentId")
            .sort({ createdAt: -1 });
        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET UNREAD COUNT
export const getUnreadCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await Notification.countDocuments({ user: userId, read: false });
        res.json({
            success: true,
            count
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// MARK AS READ
export const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { returnDocument: "after" }
        );

        res.json({ message: "Notification marked as read", notification });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// MARK ALL AS READ
export const markAllNotificationsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        await Notification.updateMany({ user: userId, read: false }, { read: true });
        res.json({ message: "All notifications marked as read" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE INDIVIDUAL NOTIFICATION
export const deleteNotification = async (req, res) => {
    try {
        console.log(`Deleting notification: ${req.params.id} for user: ${req.user._id}`);
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            console.log("Notification not found or doesn't belong to user");
            return res.status(404).json({ message: "Notification not found" });
        }

        console.log("Notification deleted successfully");
        res.json({ message: "Notification dismissed", notification });
    } catch (error) {
        console.error("Delete notification error:", error);
        res.status(500).json({ message: error.message });
    }
};
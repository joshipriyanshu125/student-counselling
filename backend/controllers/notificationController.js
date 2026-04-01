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
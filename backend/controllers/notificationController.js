const Notification = require("../models/Notification");


// GET USER NOTIFICATIONS
exports.getNotifications = async (req, res) => {

    const notifications = await Notification.find({
        user: req.user._id,
    })
        .populate("appointmentId", "type roomId status date time")
        .sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        data: notifications,
    });
};


// MARK NOTIFICATION AS READ
exports.markNotificationRead = async (req, res) => {

    const notification = await Notification.findById(req.params.id);

    if (!notification) {
        res.status(404);
        throw new Error("Notification not found");
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
        success: true,
        message: "Notification marked as read",
    });
};


// MARK ALL NOTIFICATIONS AS READ
exports.markAllNotificationsRead = async (req, res) => {

    await Notification.updateMany(
        { user: req.user._id, read: false },
        { $set: { read: true } }
    );

    res.status(200).json({
        success: true,
        message: "All notifications marked as read",
    });
};

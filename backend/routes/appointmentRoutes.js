const express = require("express");
const router = express.Router();

const Appointment = require("../models/Appointment"); // ✅ ADD THIS

const {
    bookAppointment,
    getMyAppointments,
    getCounsellorAppointments,
    updateAppointmentStatus,
    getCounsellors,
    startMeeting,
    getAppointmentByRoomId,
    endMeeting,
} = require("../controllers/appointmentController");

const {
    protect,
    allowStudent,
    allowCounsellor,
} = require("../middleware/authMiddleware");

// ===============================
// ✅ VALIDATE MEETING ACCESS (NEW)
// ===============================
router.get("/appointments/room/:roomId", protect, async (req, res) => {
    try {
        const appointment = await Appointment.findOne({
            roomId: req.params.roomId,
        });

        if (!appointment) {
            return res.status(404).json({
                message: "Meeting not found",
            });
        }

        const meetingStart = new Date(`${appointment.date} ${appointment.time}`);
        const now = new Date();
        const meetingEnd = new Date(meetingStart.getTime() + 60 * 60 * 1000);

        // ❌ BLOCK: Completed
        if (appointment.status === "completed") {
            return res.status(400).json({
                message: "Meeting already completed",
            });
        }

        // ❌ BLOCK: Not started
        if (now < meetingStart) {
            return res.status(400).json({
                message: "Meeting has not started yet",
            });
        }

        // ❌ BLOCK: Expired
        if (now > meetingEnd) {
            return res.status(400).json({
                message: "Meeting has already ended",
            });
        }

        // ✅ ALLOW
        res.json({
            success: true,
            data: appointment,
        });

    } catch (error) {
        console.error("Validation error:", error);
        res.status(500).json({
            message: "Server error",
        });
    }
});

// ===============================
// EXISTING ROUTES (UNCHANGED)
// ===============================

// Get counsellors
router.get(
    "/counsellors",
    protect,
    getCounsellors
);

// Book appointment (student)
router.post(
    "/appointments",
    protect,
    allowStudent,
    bookAppointment
);

// Get logged-in student's appointments
router.get(
    "/appointments/my",
    protect,
    allowStudent,
    getMyAppointments
);

// Get counsellor appointments
router.get(
    "/appointments/counsellor",
    protect,
    allowCounsellor,
    getCounsellorAppointments
);

// Update appointment status
router.patch(
    "/appointments/:id",
    protect,
    allowCounsellor,
    updateAppointmentStatus
);

// Start meeting (counsellor)
router.post(
    "/appointments/:id/start-meeting",
    protect,
    allowCounsellor,
    startMeeting
);

// End meeting (counsellor)
router.patch(
    "/appointments/:id/end-meeting",
    protect,
    allowCounsellor,
    endMeeting
);

module.exports = router;
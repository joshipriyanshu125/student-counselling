import express from "express";
import Appointment from "../models/Appointment.js";

import {
    bookAppointment,
    getMyAppointments,
    getCounsellorAppointments,
    updateAppointmentStatus,
    getCounsellors,
    startMeeting,
    getAppointmentByRoomId,
    endMeeting,
} from "../controllers/appointmentController.js";

import {
    protect,
    allowStudent,
    allowCounsellor,
} from "../middleware/authMiddleware.js";

const router = express.Router();

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

        if (appointment.status === "completed") {
            return res.status(400).json({ message: "Meeting already completed" });
        }

        if (now < meetingStart) {
            return res.status(400).json({ message: "Meeting has not started yet" });
        }

        if (now > meetingEnd) {
            return res.status(400).json({ message: "Meeting has already ended" });
        }

        res.json({
            success: true,
            data: appointment,
        });

    } catch (error) {
        console.error("Validation error:", error);
        res.status(500).json({ message: "Server error" });
    }
});

router.get("/counsellors", protect, getCounsellors);

router.post("/appointments", protect, allowStudent, bookAppointment);

router.get("/appointments/my", protect, allowStudent, getMyAppointments);

router.get("/appointments/counsellor", protect, allowCounsellor, getCounsellorAppointments);

router.patch("/appointments/:id", protect, allowCounsellor, updateAppointmentStatus);

router.post("/appointments/:id/start-meeting", protect, allowCounsellor, startMeeting);

router.patch("/appointments/:id/end-meeting", protect, allowCounsellor, endMeeting);

export default router;
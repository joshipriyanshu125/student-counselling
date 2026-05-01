import mongoose from "mongoose";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import sendEmail from "../utils/sendEmail.js";

// BOOK APPOINTMENT
export const bookAppointment = async (req, res) => {
    try {
        const { counsellorId, date, time, reason, type } = req.body;
        const studentId = req.user.id;

        const appointment = new Appointment({
            student: studentId,
            counsellor: counsellorId,
            date,
            time,
            reason,
            type,
            roomId: `room-${Math.random().toString(36).substr(2, 9)}`,
            status: "pending"
        });

        await appointment.save();

        const notification = await Notification.create({
            user: counsellorId,
            message: "You have a new appointment request.",
            type: "general",
            appointmentId: appointment._id
        });

        // Emit real-time notification
        req.app.get("io").to(`user_${counsellorId}`).emit("new_notification", notification);

        // Send Email Notification to counsellor
        const counsellor = await User.findById(counsellorId);
        if (counsellor && counsellor.notificationPreferences?.appointmentReminders?.email) {
            const subject = "New Appointment Request - Student Counselling";
            const message = `Hello ${counsellor.fullName},\n\nYou have a new appointment request for ${date} at ${time}.\n\nReason: ${reason}\n\nPlease log in to the dashboard to manage your appointments.`;
            await sendEmail(counsellor.email, subject, message);
        }


        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET MY APPOINTMENTS (Student)
export const getMyAppointments = async (req, res) => {
    try {
        const studentId = req.user.id;
        const appointments = await Appointment.find({ student: studentId })
            .populate("counsellor", "fullName email specialization profilePic")
            .sort({ date: 1 });

        res.json({
            success: true,
            data: appointments
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET COUNSELLOR APPOINTMENTS
export const getCounsellorAppointments = async (req, res) => {
    try {
        const counsellorId = req.user.id;
        const appointments = await Appointment.find({ counsellor: counsellorId })
            .populate("student", "fullName email studentId program phone profilePic")
            .sort({ date: 1 });

        res.json({
            success: true,
            data: appointments
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// UPDATE STATUS
export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const allowedStatuses = ["pending", "approved", "rejected", "completed"];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid appointment status" });
        }

        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status },
            { returnDocument: "after" }
        );

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const statusMessageMap = {
            approved: "Your appointment has been approved.",
            rejected: "Your appointment has been rejected.",
            completed: "Your appointment session has been marked completed.",
            pending: "Your appointment status has been updated."
        };

        const notification = await Notification.create({
            user: appointment.student,
            message: statusMessageMap[status] || "Your appointment status has been updated.",
            type: "general",
            appointmentId: appointment._id
        });

        // Emit real-time notification
        req.app.get("io").to(`user_${appointment.student}`).emit("new_notification", notification);

        // Send Email Notification to student
        const student = await User.findById(appointment.student);
        if (student && student.notificationPreferences?.appointmentReminders?.email) {
            const subject = "Appointment Status Updated - Student Counselling";
            const message = `Hello ${student.fullName},\n\n${statusMessageMap[status] || "Your appointment status has been updated."}\n\nAppointment Details:\nDate: ${appointment.date}\nTime: ${appointment.time}\n\nPlease check your dashboard for more details.`;
            await sendEmail(student.email, subject, message);
        }


        res.json({
            success: true,
            message: "Appointment status updated",
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET COUNSELLORS
export const getCounsellors = async (req, res) => {
    try {
        const counsellors = await User.find({ role: "counsellor", isApproved: true })
            .select("fullName email specialization rating phone experience about profilePic");

        res.json({
            success: true,
            data: counsellors
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// START MEETING
export const startMeeting = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.status === "completed") {
            return res.status(400).json({ message: "Cannot start a completed meeting" });
        }

        if (appointment.status !== "approved") {
            return res.status(400).json({ message: "Only approved appointments can be started" });
        }

        appointment.isStarted = true;
        await appointment.save();

        // Send Notification to student
        const notification = await Notification.create({
            user: appointment.student,
            message: `Your counsellor has started the ${appointment.type} meeting session.`,
            type: "meeting_started",
            appointmentId: appointment._id
        });

        // Emit real-time notification
        req.app.get("io").to(`user_${appointment.student}`).emit("new_notification", notification);

        // Send Email Notification to student
        const student = await User.findById(appointment.student);
        if (student && student.notificationPreferences?.appointmentReminders?.email) {
            const subject = "Counselling Meeting Started";
            const message = `Hello ${student.fullName},\n\nYour counsellor has started your ${appointment.type} meeting session. You can join now via your dashboard.\n\nRoom ID: ${appointment.roomId}`;
            await sendEmail(student.email, subject, message);
        }


        res.json({
            success: true,
            message: "Meeting started and student notified",
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET APPOINTMENT BY ROOM ID
export const getAppointmentByRoomId = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ roomId: req.params.roomId })
            .populate("student", "fullName")
            .populate("counsellor", "fullName");

        if (!appointment) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        res.json({
            success: true,
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// JOIN MEETING BY ROOM ID (single join per user)
export const joinMeetingByRoomId = async (req, res) => {
    try {
        const userId = req.user.id;
        const appointment = await Appointment.findOne({ roomId: req.params.roomId })
            .populate("student", "fullName")
            .populate("counsellor", "fullName");

        if (!appointment) {
            return res.status(404).json({ message: "Meeting not found" });
        }

        const userIdStr = String(userId);
        const isParticipant =
            String(appointment.student?._id || appointment.student) === userIdStr ||
            String(appointment.counsellor?._id || appointment.counsellor) === userIdStr;

        if (!isParticipant) {
            return res.status(403).json({ message: "You are not allowed to join this meeting" });
        }

        if (appointment.status === "completed") {
            return res.status(400).json({ message: "Meeting already completed" });
        }

        const meetingStart = new Date(`${appointment.date} ${appointment.time}`);
        const now = new Date();
        const meetingEnd = new Date(meetingStart.getTime() + 60 * 60 * 1000);

        if (!appointment.isStarted && now < meetingStart) {
            return res.status(400).json({ message: "Meeting has not started yet" });
        }

        if (now > meetingEnd) {
            return res.status(400).json({ message: "Meeting has already ended" });
        }

        // Add user to joinedUsers if not already present (for tracking, but don't block)
        if (!(appointment.joinedUsers || []).some(id => String(id) === userIdStr)) {
            appointment.joinedUsers = [...(appointment.joinedUsers || []), userId];
            await appointment.save();
        }

        return res.json({
            success: true,
            data: appointment,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// END MEETING
export const endMeeting = async (req, res) => {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            { status: "completed" },
            { returnDocument: "after" }
        );

        res.json({
            success: true,
            message: "Meeting ended",
            data: appointment
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
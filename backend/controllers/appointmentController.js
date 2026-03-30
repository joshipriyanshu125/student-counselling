const User = require("../models/User");
const Appointment = require("../models/Appointment");
const Notification = require("../models/Notification");


// ==============================
// GET ALL COUNSELLORS
// ==============================
exports.getCounsellors = async (req, res) => {
    try {

        const counsellors = await User.find({ role: "counsellor" })
            .select("-password");

        res.status(200).json({
            success: true,
            data: counsellors
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to fetch counsellors"
        });

    }
};


// ==============================
// STUDENT BOOK APPOINTMENT
// ==============================
exports.bookAppointment = async (req, res) => {

    try {

        const { counsellorId, date, time, mode, message } = req.body;

        if (!counsellorId || !date || !time || !mode) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const counsellor = await User.findById(counsellorId);

        if (!counsellor) {
            return res.status(404).json({
                success: false,
                message: "Counsellor not found"
            });
        }

        if (counsellor.role !== "counsellor") {
            return res.status(400).json({
                success: false,
                message: "Selected user is not a counsellor"
            });
        }

        // ✅ STEP 5: Generate Room ID for video/audio
        const roomId =
            mode === "video" || mode === "audio"
                ? "room_" + Date.now()
                : null;

        const appointment = await Appointment.create({
            student: req.user._id,
            counsellor: counsellorId,
            date,
            time,
            mode,
            type: mode,      // ✅ NEW FIELD (for call system)
            roomId: roomId,  // ✅ NEW FIELD (for Zego call)
            reason: message || "",
            status: "pending"
        });

        await Notification.create({
            user: counsellorId,
            message: "You have a new appointment request"
        });

        res.status(201).json({
            success: true,
            message: "Appointment booked successfully",
            data: appointment
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to book appointment"
        });

    }

};


// ==============================
// STUDENT VIEW OWN APPOINTMENTS
// ==============================
exports.getMyAppointments = async (req, res) => {

    try {

        const appointments = await Appointment.find({
            student: req.user._id
        })
            .populate("counsellor", "fullName specialization rating email");

        res.status(200).json({
            success: true,
            data: appointments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to load appointments"
        });

    }

};


// ==============================
// COUNSELLOR VIEW APPOINTMENTS
// ==============================
exports.getCounsellorAppointments = async (req, res) => {

    try {

        const appointments = await Appointment.find({
            counsellor: req.user._id
        })
            .populate("student", "fullName email");

        res.status(200).json({
            success: true,
            data: appointments
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to load appointments"
        });

    }

};


// ==============================
// COUNSELLOR APPROVE / REJECT
// ==============================
exports.updateAppointmentStatus = async (req, res) => {

    try {

        const { status } = req.body;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status"
            });
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        appointment.status = status;

        await appointment.save();

        await Notification.create({
            user: appointment.student,
            message: `Your appointment has been ${status}`
        });

        res.status(200).json({
            success: true,
            message: "Appointment status updated",
            data: appointment
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Failed to update appointment"
        });

    }

};


// ==============================
// COUNSELLOR START MEETING
// ==============================
exports.startMeeting = async (req, res) => {

    try {

        const appointment = await Appointment.findById(req.params.id)
            .populate("student", "fullName");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        if (appointment.status !== "approved") {
            return res.status(400).json({
                success: false,
                message: "Appointment is not approved"
            });
        }

        if (appointment.type === "in-person") {
            return res.status(400).json({
                success: false,
                message: "Cannot start a call for in-person appointments"
            });
        }

        // Create a meeting-started notification for the student
        const callType = appointment.type === "video" ? "Video" : "Audio";

        await Notification.create({
            user: appointment.student._id,
            message: `Your counsellor has started a ${callType} Call — join now!`,
            type: "meeting_started",
            appointmentId: appointment._id
        });

        res.status(200).json({
            success: true,
            message: "Meeting started, student notified",
            data: appointment
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Failed to start meeting"
        });

    }
};

// ==============================
// GET APPOINTMENT BY ROOM ID
// ==============================
exports.getAppointmentByRoomId = async (req, res) => {
    try {
        const appointment = await Appointment.findOne({ roomId: req.params.roomId })
            .select("_id status type roomId");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found for this room"
            });
        }

        res.status(200).json({
            success: true,
            data: appointment
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch appointment"
        });
    }
};

// ==============================
// COUNSELLOR END MEETING
// ==============================
exports.endMeeting = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        // Only the assigned counsellor can end the meeting
        if (appointment.counsellor.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to end this meeting"
            });
        }

        appointment.status = "completed";
        await appointment.save();

        res.status(200).json({
            success: true,
            message: "Meeting ended successfully",
            data: appointment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to end meeting"
        });
    }
};

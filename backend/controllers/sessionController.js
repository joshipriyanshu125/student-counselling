import Session from "../models/Session.js";
import Appointment from "../models/Appointment.js";

// CREATE SESSION (Counsellor)
export const createSession = async (req, res) => {
    try {
        const { appointmentId, notes, recommendations, followUpDate } = req.body;

        if (!appointmentId) {
            console.error("No appointmentId provided in request body:", req.body);
            return res.status(400).json({ message: "Appointment ID is required" });
        }

        console.log("🛠️ Attempting to create session for appointmentId:", appointmentId);
        console.log("📝 Session notes:", notes);

        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            console.error("No appointment found for ID:", appointmentId);
            return res.status(404).json({ message: "Associated meeting not found" });
        }

        if (appointment.status === "completed") {
            return res.status(409).json({ message: "Session is already completed for this appointment" });
        }

        const existingSession = await Session.findOne({ appointment: appointmentId });
        if (existingSession) {
            return res.status(409).json({ message: "Session already exists for this appointment" });
        }

        console.log("Found appointment. student:", appointment.student, "counsellor:", appointment.counsellor);

        const session = new Session({
            appointment: appointmentId,
            student: appointment.student,
            counsellor: appointment.counsellor,
            notes,
            recommendations,
            followUpDate
        });

        console.log("Attempting to save session object:", session);

        await session.save();

        appointment.status = "completed";
        appointment.isStarted = false;
        await appointment.save();

        res.status(201).json({ 
            success: true,
            message: "Session recorded successfully", 
            session 
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SESSIONS BY STUDENT
export const getStudentSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = await Session.find({ student: userId }).populate("counsellor appointment");
        res.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SESSIONS BY COUNSELLOR
export const getCounsellorSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = await Session.find({ counsellor: userId }).populate("student appointment");
        res.json({
            success: true,
            data: sessions
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SESSION BY ID
export const getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id).populate("student counsellor appointment");
        if (!session) {
            return res.status(404).json({ message: "Session not found" });
        }
        res.json({
            success: true,
            data: session
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
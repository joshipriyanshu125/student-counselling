import Session from "../models/Session.js";
import Appointment from "../models/Appointment.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";

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

        // Send Email Notification to student if they enabled sessionNotes email
        const student = await User.findById(appointment.student);
        if (student && student.notificationPreferences?.sessionNotes?.email) {
            const counsellor = await User.findById(appointment.counsellor);
            const subject = "New Session Notes Available - Student Counselling";
            const text = `Hello ${student.fullName},\n\nYour counsellor, ${counsellor?.fullName || "the counsellor"}, has shared notes and recommendations for your recent session.\n\nPlease log in to your dashboard to view the details.\n\nRecommendations: ${recommendations || "No specific recommendations provided."}`;
            await sendEmail(student.email, subject, text);
        }

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
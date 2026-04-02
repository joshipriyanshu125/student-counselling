import Feedback from "../models/Feedback.js";
import Session from "../models/Session.js";

// CREATE FEEDBACK
export const createFeedback = async (req, res) => {
    try {
        const { sessionId, rating, comment } = req.body;
        const studentId = req.user.id;

        if (!sessionId) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        console.log("🛠️ Attempting to submit feedback for sessionId:", sessionId);

        const session = await Session.findById(sessionId);
        if (!session) {
            console.error("No session found for ID:", sessionId);
            return res.status(404).json({ message: "Associated session not found" });
        }

        if (String(session.student) !== String(studentId)) {
            return res.status(403).json({ message: "You can only leave feedback for your own sessions" });
        }

        console.log("Found session. student:", session.student, "counsellor:", session.counsellor);

        const existing = await Feedback.findOne({ session: sessionId, student: studentId });
        if (existing) {
            return res.status(409).json({ message: "Feedback already submitted for this session" });
        }

        const feedback = new Feedback({
            student: studentId,
            counsellor: session.counsellor,
            session: sessionId,
            rating,
            comment,
        });

        console.log("Attempting to save feedback object:", feedback);

        await feedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback
        });

    } catch (error) {
        console.error("Feedback creation error:", error.message);
        if (error?.code === 11000) {
            return res.status(409).json({ message: "Feedback already submitted for this session" });
        }
        res.status(500).json({ message: error.message });
    }
};

// GET COUNSELLOR FEEDBACK
export const getCounsellorFeedback = async (req, res) => {
    try {
        const counsellorId = req.user.id;
        const feedbacks = await Feedback.find({ counsellor: counsellorId })
            .populate("student", "fullName")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: feedbacks
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET STUDENT FEEDBACK
export const getStudentFeedback = async (req, res) => {
    try {
        const studentId = req.user.id;
        const feedbacks = await Feedback.find({ student: studentId })
            .populate("counsellor", "fullName")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: feedbacks
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SESSION FEEDBACK
export const getSessionFeedback = async (req, res) => {
    try {
        const sessionId = req.params.sessionId;

        const query =
            req.user?.role === "student"
                ? { session: sessionId, student: req.user.id }
                : { session: sessionId };

        const feedback = await Feedback.findOne(query).populate("student counsellor", "fullName");

        res.json({
            success: true,
            data: feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

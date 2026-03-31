import Feedback from "../models/Feedback.js";

// CREATE FEEDBACK
export const createFeedback = async (req, res) => {
    try {
        const { counsellorId, sessionId, rating, comment } = req.body;
        const studentId = req.user.id;

        const feedback = new Feedback({
            student: studentId,
            counsellor: counsellorId,
            session: sessionId,
            rating,
            comment,
        });

        await feedback.save();

        res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback
        });

    } catch (error) {
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
        const feedback = await Feedback.findOne({ session: req.params.sessionId })
            .populate("student counsellor", "fullName");

        res.json({
            success: true,
            data: feedback
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

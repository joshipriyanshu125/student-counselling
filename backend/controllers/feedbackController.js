const Feedback = require("../models/Feedback");
const Session = require("../models/Session");


// STUDENT CREATE FEEDBACK
exports.createFeedback = async (req, res) => {

    const { sessionId, rating, comment } = req.body;

    const session = await Session.findById(sessionId);

    if (!session) {
        res.status(404);
        throw new Error("Session not found");
    }

    // Students can only leave feedback for their own sessions
    if (session.student.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            success: false,
            message: "Not authorized to leave feedback for this session",
        });
    }

    const feedback = await Feedback.create({
        student: req.user._id,
        counsellor: session.counsellor,
        session: sessionId,
        rating,
        comment,
    });

    res.status(201).json({
        success: true,
        message: "Feedback submitted",
        data: feedback,
    });
};

// GET FEEDBACK FOR A SESSION (student or counsellor)
exports.getSessionFeedback = async (req, res) => {
    const session = await Session.findById(req.params.sessionId);

    if (!session) {
        return res.status(404).json({
            success: false,
            message: "Session not found",
        });
    }

    const userId = req.user?._id?.toString();
    const isOwner =
        session.student.toString() === userId ||
        session.counsellor.toString() === userId ||
        req.user?.role === "admin";

    if (!isOwner) {
        return res.status(403).json({
            success: false,
            message: "Not authorized to view feedback for this session",
        });
    }

    const feedback = await Feedback.find({ session: session._id })
        .populate("student", "fullName email")
        .sort({ createdAt: -1 });

    return res.status(200).json({
        success: true,
        data: feedback,
    });
};


// GET FEEDBACK LEFT BY THE STUDENT
exports.getStudentFeedback = async (req, res) => {
    try {
        const feedback = await Feedback.find({ student: req.user._id })
            .populate("counsellor", "fullName email")
            .populate("session")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: feedback,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch student feedback",
            error: error.message
        });
    }
};

// GET COUNSELLOR FEEDBACK
exports.getCounsellorFeedback = async (req, res) => {

    const feedback = await Feedback.find({ counsellor: req.user._id })
        .populate("student", "email")
        .populate("session");

    res.status(200).json({
        success: true,
        data: feedback,
    });
};
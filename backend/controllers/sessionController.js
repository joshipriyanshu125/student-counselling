import Session from "../models/Session.js";

// CREATE SESSION (Counsellor)
export const createSession = async (req, res) => {
    try {
        const session = new Session(req.body);
        await session.save();

        res.status(201).json({ message: "Session created", session });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SESSIONS BY STUDENT
export const getStudentSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = await Session.find({ student: userId }).populate("counsellor appointment");
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET SESSIONS BY COUNSELLOR
export const getCounsellorSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const sessions = await Session.find({ counsellor: userId }).populate("student appointment");
        res.json(sessions);
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
        res.json(session);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
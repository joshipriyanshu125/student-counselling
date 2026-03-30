const Session = require("../models/Session");
const Appointment = require("../models/Appointment");


// Helper to normalize date formats (e.g., DD-MM-YYYY to YYYY-MM-DD)
const normalizeDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") return null;

    const ddmmyyyyRegex = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
    const match = dateStr.match(ddmmyyyyRegex);

    if (match) {
        const [_, day, month, year] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return dateStr;
};

// COUNSELLOR CREATE SESSION
exports.createSession = async (req, res) => {
    try {
        const { appointmentId, notes, recommendations, followUpDate } = req.body;

        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required"
            });
        }

        const appointment = await Appointment.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found"
            });
        }

        const counsellorId = appointment.counsellor?._id || appointment.counsellor;
        const studentId = appointment.student?._id || appointment.student;

        if (counsellorId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to create session for this appointment"
            });
        }

        if (!["approved", "completed"].includes(appointment.status)) {
            return res.status(400).json({
                success: false,
                message: "Appointment must be approved or already ended before completing a session"
            });
        }

        const sessionData = {
            appointment: appointment._id,
            student: studentId,
            counsellor: counsellorId,
            notes: notes || "No notes provided",
            recommendations: recommendations || "",
        };

        // Date handling
        if (followUpDate && followUpDate.trim() !== "") {
            const normalized = normalizeDate(followUpDate.trim());
            const parsedDate = new Date(normalized);

            if (!isNaN(parsedDate.getTime())) {
                sessionData.followUpDate = parsedDate;
            } else {
                console.warn(`Invalid followUpDate provided: "${followUpDate}". Proceeding without date.`);
            }
        }

        const session = await Session.create(sessionData);

        // ✅ FIXED: Properly update appointment status + updatedAt
        await Appointment.findByIdAndUpdate(
            appointment._id,
            {
                status: "completed",
                updatedAt: new Date() // 🔥 VERY IMPORTANT FIX
            },
            { new: true }
        );

        res.status(201).json({
            success: true,
            message: "Session recorded successfully",
            data: session,
        });

    } catch (error) {
        console.error("Critical Session Creation Error:", error);

        if (error?.name === "ValidationError" || error?.name === "CastError") {
            const details =
                error?.name === "ValidationError"
                    ? Object.values(error.errors || {})
                        .map((e) => e.message)
                        .filter(Boolean)
                        .join(", ")
                    : error.message;

            return res.status(400).json({
                success: false,
                message: details || "Invalid input. Please check all fields.",
            });
        }

        res.status(500).json({
            success: false,
            message: error?.message || "Failed to save session",
        });
    }
};


// STUDENT VIEW SESSION HISTORY
exports.getStudentSessions = async (req, res) => {
    const sessions = await Session.find({
        student: req.user._id,
    })
        .populate("counsellor", "fullName email")
        .populate("appointment");

    res.status(200).json({
        success: true,
        data: sessions,
    });
};


// COUNSELLOR VIEW SESSION HISTORY
exports.getCounsellorSessions = async (req, res) => {
    const sessions = await Session.find({
        counsellor: req.user._id,
    })
        .populate("student", "fullName email")
        .populate("appointment");

    res.status(200).json({
        success: true,
        data: sessions,
    });
};


// VIEW A SINGLE SESSION
exports.getSessionById = async (req, res) => {
    try {
        const session = await Session.findById(req.params.id)
            .populate("student", "fullName email")
            .populate("counsellor", "fullName email")
            .populate("appointment");

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Session not found",
            });
        }

        const userId = req.user?._id?.toString();
        const isOwner =
            session.student?.toString?.() === userId ||
            session.counsellor?.toString?.() === userId ||
            session.student?._id?.toString?.() === userId ||
            session.counsellor?._id?.toString?.() === userId;

        if (!isOwner && req.user?.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this session",
            });
        }

        return res.status(200).json({
            success: true,
            data: session,
        });

    } catch (error) {
        console.error("Get session by id error:", error);

        if (error?.name === "CastError") {
            return res.status(400).json({
                success: false,
                message: "Invalid session id",
            });
        }

        return res.status(500).json({
            success: false,
            message: "Failed to load session details",
        });
    }
};
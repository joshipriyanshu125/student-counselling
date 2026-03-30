const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
    {
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment",
            required: true,
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        counsellor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        notes: {
            type: String,
            required: true,
        },
        recommendations: {
            type: String,
        },
        followUpDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Session", sessionSchema);
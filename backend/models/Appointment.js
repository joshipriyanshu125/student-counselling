import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
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

        date: {
            type: Date,
            required: true,
        },

        time: {
            type: String,
            required: true,
        },

        reason: {
            type: String,
            required: true,
        },

        // ✅ NEW: appointment type
        type: {
            type: String,
            enum: ["video", "audio", "in-person"],
            required: true,
        },

        // ✅ NEW: room ID for call
        roomId: {
            type: String,
        },

        status: {
            type: String,
            enum: ["pending", "approved", "rejected", "completed"],
            default: "pending",
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Appointment", appointmentSchema);
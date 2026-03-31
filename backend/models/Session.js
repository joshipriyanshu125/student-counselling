import mongoose from "mongoose";

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

export default mongoose.model("Session", sessionSchema);
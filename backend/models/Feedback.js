import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        counsellor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        session: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Session",
            required: true
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            required: true
        },

        comment: {
            type: String,
            trim: true,
        }
    },
    { timestamps: true }
);

feedbackSchema.index({ session: 1, student: 1 }, { unique: true });

export default mongoose.model("Feedback", feedbackSchema);
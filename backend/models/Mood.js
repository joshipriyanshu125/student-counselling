import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        mood: {
            type: Number, // 1 to 5
            required: true,
        },
        note: {
            type: String,
            default: "",
        },
        date: {
            type: Date,
            default: Date.now,
        }
    },
    {
        timestamps: true,
    }
);

// Index to quickly find user moods for a date range
moodSchema.index({ user: 1, date: -1 });

export default mongoose.model("Mood", moodSchema);

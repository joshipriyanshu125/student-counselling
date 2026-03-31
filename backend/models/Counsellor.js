import mongoose from "mongoose";

const counsellorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        default: 4.5
    },
    email: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Counsellor", counsellorSchema);
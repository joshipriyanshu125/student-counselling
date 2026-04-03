import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },

        phone: {
            type: String,
            trim: true,
            default: "",
        },

        studentId: {
            type: String,
            trim: true,
            default: "",
        },

        program: {
            type: String,
            trim: true,
            default: "",
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
        },

        role: {
            type: String,
            enum: ["student", "counsellor", "admin"],
            default: "student",
        },

        isApproved: {
            type: Boolean,
            default: function () {
                return this.role !== "counsellor";
            },
        },

        specialization: {
            type: String,
            default: "",
        },

        rating: {
            type: Number,
            default: 5,
        },

        bio: {
            type: String,
            default: "",
        },

        location: {
            type: String,
            default: "",
        },

        yearsOfExperience: {
            type: Number,
            default: 0,
        },

        tags: {
            type: [String],
            default: [],
        },

        ratingCount: {
            type: Number,
            default: 0,
        },

        availability: [
            {
                day: String,
                slots: [String],
            }
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
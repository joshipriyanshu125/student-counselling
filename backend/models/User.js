const mongoose = require("mongoose");

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

        // ✅ NEW: Approval system for counsellor
        isApproved: {
            type: Boolean,
            default: function () {
                // auto approve students & admins
                return this.role !== "counsellor";
            },
        },

        // Counsellor specific
        specialization: {
            type: String,
            default: "",
        },

        rating: {
            type: Number,
            default: 5,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
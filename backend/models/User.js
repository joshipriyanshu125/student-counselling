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

        notificationPreferences: {
            appointmentReminders: {
                email: { type: Boolean, default: true },
                push: { type: Boolean, default: true }
            },
            newMessages: {
                email: { type: Boolean, default: true },
                push: { type: Boolean, default: true }
            },
            sessionNotes: {
                email: { type: Boolean, default: true },
                push: { type: Boolean, default: false }
            },
            systemAlerts: {
                email: { type: Boolean, default: true },
                push: { type: Boolean, default: true }
            },
            feedbackRequests: {
                email: { type: Boolean, default: false },
                push: { type: Boolean, default: true }
            }
        },

        profilePic: {
            type: String,
            default: "",
        },
        settings: {
            language: { type: String, default: "English" },
            timezone: { type: String, default: "(GMT+05:30) Mumbai, Kolkata" },
            dateFormat: { type: String, default: "DD/MM/YYYY" },
            timeFormat: { type: String, default: "12-hour" },
            accessibility: {
                reduceMotion: { type: Boolean, default: false },
                highContrast: { type: Boolean, default: false },
                screenReader: { type: Boolean, default: false },
                keyboardNav: { type: Boolean, default: false },
                alwaysShowCaptions: { type: Boolean, default: false }
            }
        }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
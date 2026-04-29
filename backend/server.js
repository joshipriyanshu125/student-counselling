import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/errorMiddleware.js";
import { protect } from "./middleware/authMiddleware.js";

// Routes
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import counsellorRoutes from "./routes/counsellorRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
import { fileURLToPath } from "url";


// Socket
import socketHandler from "./sockets/socket.js";

const app = express();

// Connect Database
connectDB();

// Enable CORS
app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);

            if (/^http:\/\/localhost:517\d{1,2}$/.test(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
        credentials: true,
    })
);

// Body Parser
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


/* ================= PROFILE ROUTES ================= */

app.all("/api/profile", protect, async (req, res) => {
    const u = req.user;

    if (req.method === "GET") {
        return res.json({
            name: u.fullName || "",
            email: u.email || "",
            phone: u.phone || "",
            studentId: u.studentId || "",
            program: u.program || "",
            role: u.role,
        });
    }

    if (["PUT", "PATCH", "POST"].includes(req.method)) {
        try {
            const { name, fullName, email, phone, studentId, program } = req.body || {};

            if (typeof name === "string") u.fullName = name.trim();
            if (typeof fullName === "string") u.fullName = fullName.trim();
            if (typeof email === "string") u.email = email.trim().toLowerCase();
            if (typeof phone === "string") u.phone = phone.trim();
            if (typeof studentId === "string") u.studentId = studentId.trim();
            if (typeof program === "string") u.program = program.trim();

            const saved = await u.save();

            return res.json({
                name: saved.fullName || "",
                email: saved.email || "",
                phone: saved.phone || "",
                studentId: saved.studentId || "",
                program: saved.program || "",
                role: saved.role,
            });
        } catch {
            return res.status(400).json({
                success: false,
                message: "Failed to update profile",
            });
        }
    }

    return res.status(405).json({
        success: false,
        message: "Method not allowed",
    });
});

app.post("/api/profile-save", protect, async (req, res) => {
    try {
        const u = req.user;
        const { name, fullName, email, phone, studentId, program } = req.body || {};

        if (typeof name === "string") u.fullName = name.trim();
        if (typeof fullName === "string") u.fullName = fullName.trim();
        if (typeof email === "string") u.email = email.trim().toLowerCase();
        if (typeof phone === "string") u.phone = phone.trim();
        if (typeof studentId === "string") u.studentId = studentId.trim();
        if (typeof program === "string") u.program = program.trim();

        const saved = await u.save();

        return res.json({
            name: saved.fullName || "",
            email: saved.email || "",
            phone: saved.phone || "",
            studentId: saved.studentId || "",
            program: saved.program || "",
            role: saved.role,
        });
    } catch {
        return res.status(400).json({
            success: false,
            message: "Failed to update profile",
        });
    }
});

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api", profileRoutes);
app.use("/api", protectedRoutes);
app.use("/api", appointmentRoutes);
app.use("/api", sessionRoutes);
app.use("/api", notificationRoutes);
app.use("/api", feedbackRoutes);
app.use("/api", counsellorRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/upload", uploadRoutes);



// Test Route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// 404 fallback
app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
    });
});

// Error Middleware
app.use(errorHandler);

/* ================= SOCKET.IO ================= */

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true,
        credentials: true,
    },
});

// Attach io to app so it can be used in controllers
app.set("io", io);

socketHandler(io);


/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
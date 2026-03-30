require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

const errorHandler = require("./middleware/errorMiddleware");
const { protect } = require("./middleware/authMiddleware");

// Socket + Chat
const socketHandler = require("./sockets/socket");
const messageRoutes = require("./routes/messageRoutes");

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

/* ================= PROFILE ROUTES (UNCHANGED) ================= */

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

    if (req.method === "PUT" || req.method === "PATCH" || req.method === "POST") {
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
        return res.status(400).json({ success: false, message: "Failed to update profile" });
    }
});

/* ================= ROUTES ================= */

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/profileRoutes"));
app.use("/api", require("./routes/protectedRoutes"));
app.use("/api", require("./routes/appointmentRoutes"));
app.use("/api", require("./routes/sessionRoutes"));
app.use("/api", require("./routes/notificationRoutes"));
app.use("/api", require("./routes/feedbackRoutes"));
app.use("/api", require("./routes/counsellorRoutes"));

const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// ✅ NEW: Admin routes for counsellor approval
app.use("/api/admin", require("./routes/adminRoutes"));

// Chat
app.use("/api/messages", messageRoutes);

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

socketHandler(io);

/* ================= SERVER START ================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
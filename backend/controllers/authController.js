const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ==========================
// REGISTER USER
// ==========================
exports.register = async (req, res) => {

    try {

        const { fullName, name, email, password, role } = req.body;

        const resolvedFullName =
            typeof fullName === "string"
                ? fullName
                : typeof name === "string"
                    ? name
                    : "";

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // ✅ FIX: normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const userExists = await User.findOne({ email: normalizedEmail });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userRole = role === "counsellor" ? "counsellor" : "student";

        const user = await User.create({
            fullName: resolvedFullName,
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole,
            isApproved: userRole === "counsellor" ? false : true
        });

        res.status(201).json({
            success: true,
            message:
                userRole === "counsellor"
                    ? "Registered successfully. Waiting for admin approval"
                    : "User registered successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Registration failed"
        });

    }

};


// ==========================
// LOGIN USER
// ==========================
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password required"
            });
        }

        // ✅ FIX: normalize email
        const normalizedEmail = email.toLowerCase().trim();

        const user = await User.findOne({ email: normalizedEmail });

        let isMatch = false;
        if (user) {
            isMatch = await bcrypt.compare(password, user.password);
        }

        const fs = require('fs');
        const debugInfo = `[${new Date().toISOString()}] EMAIL: "${normalizedEmail}" | PASSWORD: "${password}" | USER FOUND: ${!!user} | ROLE: ${user?.role} | MATCH: ${isMatch}\n`;
        fs.appendFileSync('login_debug.txt', debugInfo);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // ✅ block unapproved counsellor
        if (user.role === "counsellor" && !user.isApproved) {
            return res.status(403).json({
                success: false,
                message: "Your account is pending admin approval"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.fullName || "",
                email: user.email,
                phone: user.phone || "",
                studentId: user.studentId || "",
                program: user.program || "",
                role: user.role
            }
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Login failed"
        });

    }

};
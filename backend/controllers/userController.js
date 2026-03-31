import User from "../models/User.js";

// ==========================
// GET ALL USERS
// ==========================
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        res.json({
            success: true,
            data: users,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ==========================
// GET SINGLE USER
// ==========================
export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            success: true,
            data: user,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ==========================
// UPDATE USER
// ==========================
export const updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json({
            success: true,
            data: user,
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
import User from "../models/User.js";

// GET COUNSELLORS
export const getCounsellors = async (req, res) => {
    try {
        const counsellors = await User.find({ role: "counsellor", isApproved: true })
            .select("fullName email specialization rating phone yearsOfExperience bio location tags ratingCount availability");

        res.json({
            success: true,
            data: counsellors
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

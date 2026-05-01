import Mood from "../models/Mood.js";

// @desc    Log or update today's mood
// @route   POST /api/moods
// @access  Private
export const logMood = async (req, res) => {
    try {
        const { mood, note } = req.body;
        const userId = req.user._id;

        // Start of today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // End of today
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Find if user already logged mood today
        let existingMood = await Mood.findOne({
            user: userId,
            date: { $gte: today, $lt: tomorrow }
        });

        if (existingMood) {
            existingMood.mood = mood;
            existingMood.note = note;
            await existingMood.save();
            return res.json({ success: true, data: existingMood, message: "Mood updated" });
        }

        const newMood = await Mood.create({
            user: userId,
            mood,
            note,
            date: new Date()
        });

        res.status(201).json({ success: true, data: newMood, message: "Mood logged" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// @desc    Get moods for the last 7 days
// @route   GET /api/moods/stats
// @access  Private
export const getMoodStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const moods = await Mood.find({
            user: userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        // Calculate average
        const total = moods.reduce((acc, curr) => acc + curr.mood, 0);
        const avg = moods.length > 0 ? (total / moods.length).toFixed(1) : 0;

        res.json({ success: true, data: moods, average: avg });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

// @desc    Get today's mood
// @route   GET /api/moods/today
// @access  Private
export const getTodayMood = async (req, res) => {
    try {
        const userId = req.user._id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const mood = await Mood.findOne({
            user: userId,
            date: { $gte: today, $lt: tomorrow }
        });

        res.json({ success: true, data: mood });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};

const express = require("express");
const router = express.Router();
const {
    protect,
    allowStudent,
    allowCounsellor,
    allowAdmin,
} = require("../middleware/authMiddleware");



router.get("/student", protect, allowStudent, (req, res) => {
    res.json({ message: "Welcome Student 🎓" });
});



router.get("/counsellor", protect, allowCounsellor, (req, res) => {
    res.json({ message: "Welcome Counsellor 🧑‍⚕️" });
});



router.get("/admin", protect, allowAdmin, (req, res) => {
    res.json({ message: "Welcome Admin 👑" });
});

module.exports = router;
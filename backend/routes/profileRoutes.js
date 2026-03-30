const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, (req, res) => {
  const u = req.user;
  res.json({
    name: u.fullName || "",
    email: u.email || "",
    phone: u.phone || "",
    studentId: u.studentId || "",
    program: u.program || "",
    role: u.role,
  });
});

router.put("/profile", protect, async (req, res) => {
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

router.patch("/profile", protect, async (req, res) => {
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

router.post("/profile", protect, async (req, res) => {
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

router.post("/profile/update", protect, async (req, res) => {
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
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Failed to update profile",
    });
  }
});

module.exports = router;


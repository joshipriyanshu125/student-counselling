import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import attachmentUpload from "../middleware/attachmentUpload.js";

const router = express.Router();

router.post("/", protect, (req, res, next) => {
  attachmentUpload.single("file")(req, res, (err) => {
    if (err) {
      console.error("Chat Upload Error:", err);
      return res.status(400).json({ success: false, message: "Upload failed", error: err.message });
    }
    next();
  });
}, (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    // With Cloudinary, req.file.path is the full URL
    res.json({
      success: true,
      fileUrl: req.file.path,
      fileType: req.file.mimetype,
      fileName: req.file.originalname,
    });
  } catch (error) {
    console.error("Chat Route Error:", error);
    res.status(500).json({ success: false, message: "Server error during upload" });
  }
});

export default router;

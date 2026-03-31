import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

router.get("/:roomId", async (req, res) => {
    const messages = await Message.find({
        roomId: req.params.roomId,
    }).sort({ createdAt: 1 });

    res.json(messages);
});

export default router;
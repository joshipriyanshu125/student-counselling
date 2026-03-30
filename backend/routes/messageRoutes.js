const express = require("express");
const Message = require("../models/Message");

const router = express.Router();

router.get("/:roomId", async (req, res) => {
    const messages = await Message.find({
        roomId: req.params.roomId,
    }).sort({ createdAt: 1 });

    res.json(messages);
});

module.exports = router;
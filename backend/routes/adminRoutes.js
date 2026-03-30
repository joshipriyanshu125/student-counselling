const express = require("express")
const router = express.Router()
const User = require("../models/User")

// approve counsellor
router.put("/approve/:id", async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
    )

    res.json({
        success: true,
        message: "Counsellor approved",
        data: user
    })
})

module.exports = router
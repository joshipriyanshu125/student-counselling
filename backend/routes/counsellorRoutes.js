const express = require("express")
const router = express.Router()

const { getCounsellors } = require("../controllers/counsellorController")

router.get("/counsellors", getCounsellors)

module.exports = router
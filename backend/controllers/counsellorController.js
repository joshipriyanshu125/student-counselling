const Counsellor = require("../models/Counsellor")

const getCounsellors = async (req, res) => {

    try {

        const counsellors = await Counsellor.find()

        res.json(counsellors)

    } catch (error) {

        res.status(500).json({ message: "Server Error" })

    }

}

module.exports = { getCounsellors }
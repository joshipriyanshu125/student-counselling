const mongoose = require("mongoose")

const counsellorSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    specialization: {
        type: String,
        required: true
    },

    rating: {
        type: Number,
        default: 4.5
    },

    email: {
        type: String
    }

}, { timestamps: true })

module.exports = mongoose.model("Counsellor", counsellorSchema)
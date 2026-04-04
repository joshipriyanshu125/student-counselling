import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("backend", ".env") });

async function checkCounsellors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const counsellors = await User.find({ role: "counsellor" });
        console.log(`Found ${counsellors.length} counsellors`);

        counsellors.forEach(c => {
            console.log(`Name: ${c.fullName}, Bio: ${c.bio ? "Exists" : "MISSING"}`);
            if (c.bio) {
                console.log(`Bio text: ${c.bio.substring(0, 50)}...`);
            }
        });

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkCounsellors();

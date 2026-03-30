
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

const counsellors = [
    {
        fullName: "Dr. Sarah Mitchell",
        email: "sarah@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Academic Guidance",
        rating: 4.8,
    },
    {
        fullName: "Dr. James Lee",
        email: "james@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Career",
        rating: 4.8,
    },
    {
        fullName: "Ms. Priya Sharma",
        email: "priya@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Personal",
        rating: 4.8,
    },
    {
        fullName: "Mr. Robert Len",
        email: "robert@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Mental Wellness",
        rating: 4.8,
    },
];

async function seedCounsellors() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        for (const c of counsellors) {
            // Remove existing record with same email
            await User.deleteOne({ email: c.email });

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(c.password, salt);

            // Create new user with hashed password
            await User.create({
                fullName: c.fullName,
                email: c.email,
                password: hashedPassword,
                role: c.role,
                specialization: c.specialization,
                rating: c.rating,
            });

            console.log(`✅ Created counsellor: ${c.email}`);
        }

        console.log("\n✅ All counsellors seeded successfully!");
        console.log("You can now log in with:");
        counsellors.forEach(c => console.log(`  Email: ${c.email}  Password: ${c.password}`));

        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding counsellors:", err);
        process.exit(1);
    }
}

seedCounsellors();

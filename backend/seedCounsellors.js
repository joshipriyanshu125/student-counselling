import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("backend", ".env") });

const counsellors = [
    {
        fullName: "Dr. Sarah Mitchell",
        email: "sarah@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Academic Guidance",
        rating: 4.9,
        ratingCount: 128,
        location: "Block A, Room 204",
        yearsOfExperience: 12,
        bio: "Dr. Sarah Mitchell is a dedicated academic advisor with over 12 years of experience in helping students overcome learning obstacles and stress. She holds a PhD in Clinical Psychology from Stanford University and specializes in evidence-based techniques for academic success and cognitive behavioral therapy (CBT) for anxiety reduction.",
        tags: ["Academic", "Stress", "PhD"],
        availability: [
            { day: "Monday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"] },
            { day: "Tuesday", slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "04:00 PM"] },
            { day: "Wednesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"] },
            { day: "Thursday", slots: ["11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "05:00 PM"] },
            { day: "Friday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM"] },
            { day: "Saturday", slots: ["10:00 AM", "11:00 AM", "01:00 PM"] },
            { day: "Sunday", slots: ["10:00 AM", "12:00 PM"] }
        ]
    },
    {
        fullName: "Dr. James Lee",
        email: "james@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Career",
        rating: 4.8,
        ratingCount: 110,
        location: "Block C, Room 105",
        yearsOfExperience: 10,
        bio: "Dr. James Lee focuses on bridging the gap between education and employment. With a background in corporate human resources and career coaching, he provides expert guidance on internship searching, resume building, and long-term career planning. He is passionate about helping students find their professional calling and navigate the complexities of the modern job market.",
        tags: ["Career", "Finance", "Planning"],
        availability: [
            { day: "Monday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"] },
            { day: "Tuesday", slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"] },
            { day: "Wednesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"] },
            { day: "Thursday", slots: ["11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"] },
            { day: "Friday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
            { day: "Saturday", slots: ["10:00 AM", "11:00 AM"] }
        ]
    },
    {
        fullName: "Ms. Priya Sharma",
        email: "priya@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Personal",
        rating: 4.7,
        ratingCount: 95,
        location: "Block B, Room 302",
        yearsOfExperience: 8,
        bio: "Ms. Priya Sharma is a compassionate personal development coach specializing in emotional intelligence and relationship management. Having worked extensively with youth organizations, she brings a wealth of knowledge in helping students manage personal crises, build self-confidence, and develop healthy interpersonal boundaries within the university environment.",
        tags: ["Personal", "Growth", "Emotional"],
        availability: [
            { day: "Monday", slots: ["02:00 PM", "03:00 PM", "04:00 PM", "05:00 PM"] },
            { day: "Tuesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"] },
            { day: "Wednesday", slots: ["02:00 PM", "03:00 PM", "04:00 PM"] },
            { day: "Thursday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"] },
            { day: "Friday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
            { day: "Saturday", slots: ["10:00 AM", "12:00 PM", "02:00 PM"] },
            { day: "Sunday", slots: ["11:00 AM", "01:00 PM"] }
        ]
    },
    {
        fullName: "Mr. Robert Len",
        email: "robert@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Mental Wellness",
        rating: 4.8,
        ratingCount: 88,
        location: "Health Center, Room 12",
        yearsOfExperience: 15,
        bio: "Mr. Robert Len is a senior therapist focusing on mindfulness-based stress reduction and holistic mental wellness. With 15 years of experience in student welfare, he has pioneered several wellness programs on campus targeted at reducing anxiety and promoting a healthy work-life balance for high-achieving students. His approach is student-centered and focuses on building resilience.",
        tags: ["Mental Health", "Anxiety", "Wellness"],
        availability: [
            { day: "Monday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"] },
            { day: "Tuesday", slots: ["10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM"] },
            { day: "Wednesday", slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"] },
            { day: "Thursday", slots: ["11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM"] },
            { day: "Friday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
            { day: "Saturday", slots: ["10:00 AM", "01:00 PM", "03:00 PM"] }
        ]
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
                ratingCount: c.ratingCount,
                location: c.location,
                yearsOfExperience: c.yearsOfExperience,
                bio: c.bio,
                tags: c.tags,
                availability: c.availability,
                isApproved: true,
            });

            console.log(`✅ Created counsellor: ${c.email}`);
        }

        console.log("\n✅ All counsellors seeded successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Error seeding counsellors:", err);
        process.exit(1);
    }
}

seedCounsellors();

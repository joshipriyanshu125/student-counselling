import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("backend", ".env") });

/** Same slots as the Book Appointment time dropdown, repeated each day. */
const standardSlots = ["10:00 AM", "11:30 AM", "2:00 PM"];
const weekDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];
const standardWeeklyAvailability = weekDays.map((day) => ({
    day,
    slots: [...standardSlots],
}));

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
        bio: "Dr. Sarah Mitchell is a senior academic psychologist with over 12 years of specialized experience in clinical student support. She earned her PhD from Stanford University and has dedicated her career to helping students navigate the high-pressure environment of university life. Sarah specializes in Cognitive Behavioral Therapy (CBT) and Mindfulness-Based Stress Reduction (MBSR), providing students with practical tools to manage academic anxiety, overcome burnout, and optimize their learning potential.",
        tags: ["Academic", "Stress", "PhD"],
        availability: standardWeeklyAvailability.map((row) => ({ ...row, slots: [...row.slots] }))
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
        bio: "Dr. James Lee is a globally recognized career strategist and former corporate HR director with a passion for student professional development. With a decade of experience bridging the gap between academia and the workforce, James provides expert guidance on strategic career planning, advanced interview techniques, and personal branding in the digital age.",
        tags: ["Career", "Finance", "Planning"],
        availability: standardWeeklyAvailability.map((row) => ({ ...row, slots: [...row.slots] }))
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
        bio: "Ms. Priya Sharma is a certified life coach and emotional intelligence expert who has spent the last 8 years empowering students to build stronger interpersonal connections and self-confidence. Specializing in relationship dynamics, conflict resolution, and personal boundaries, Priya helps students navigate the complex social landscape of university life.",
        tags: ["Personal", "Growth", "Emotional"],
        availability: standardWeeklyAvailability.map((row) => ({ ...row, slots: [...row.slots] }))
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
        bio: "Mr. Robert Len brings over 15 years of experience in holistic mental health and student welfare to the campus health center. As a pioneer in campus wellness programming, Robert focuses on a balanced approach to student life, integrating mindfulness, stress management, and lifestyle optimization.",
        tags: ["Mental Health", "Anxiety", "Wellness"],
        availability: standardWeeklyAvailability.map((row) => ({ ...row, slots: [...row.slots] }))
    },
    {
        fullName: "Dr. Elena Rodriguez",
        email: "elena@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Academic Guidance",
        rating: 4.9,
        ratingCount: 75,
        location: "Block D, Room 401",
        yearsOfExperience: 14,
        bio: "Dr. Elena Rodriguez specializes in the unique challenges faced by international and first-generation college students. With a doctorate in Cross-Cultural Psychology, she provides a supportive environment for students navigating cultural transitions, language barriers, and the feeling of 'imposter syndrome'.",
        tags: ["International", "Culture", "Growth"],
        availability: standardWeeklyAvailability.map((row) => ({ ...row, slots: [...row.slots] }))
    },
    {
        fullName: "Mr. David Chen",
        email: "david@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Personal",
        rating: 4.6,
        ratingCount: 62,
        location: "Block B, Room 305",
        yearsOfExperience: 7,
        bio: "Mr. David Chen is a licensed family therapist who focuses on relationship health and communication. He helps students navigate complex family dynamics, roommate conflicts, and the transition to independent living. David's approach is grounded in systems theory, helping individuals understand their roles within larger social groups.",
        tags: ["Relationships", "Communication", "Systemic"],
        availability: standardWeeklyAvailability.map((row) => ({ ...row, slots: [...row.slots] }))
    },
    {
        fullName: "Dr. Michael Thompson",
        email: "michael@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Mental Wellness",
        rating: 5.0,
        ratingCount: 45,
        location: "Health Center, Room 08",
        yearsOfExperience: 18,
        bio: "Dr. Michael Thompson is an expert in neurodiversity and learning difficulties, including ADHD and Dyslexia. With nearly two decades of experience, he provides tailored strategies for students who process information differently, ensuring they have the accommodations and cognitive tools necessary to thrive in a conventional academic setting.",
        tags: ["Neurodiversity", "ADHD", "Learning"],
        availability: standardWeeklyAvailability.map((row) => ({ ...row, slots: [...row.slots] }))
    },
    {
        fullName: "Ms. Linda Wu",
        email: "linda@example.com",
        password: "123456",
        role: "counsellor",
        specialization: "Mental Wellness",
        rating: 4.8,
        ratingCount: 54,
        location: "Health Center, Room 15",
        yearsOfExperience: 9,
        bio: "Ms. Linda Wu specializes in trauma-informed care and grief counselling. She provides a gentle, supportive environment for students dealing with loss or past traumatic experiences. Linda is certified in EMDR and focuses on somatic techniques to help students process difficult emotions and find a path toward healing and recovery.",
        tags: ["Trauma", "Grief", "Healing"],
        availability: standardWeeklyAvailability.map((row) => ({ ...row, slots: [...row.slots] }))
    }
];

async function seedCounsellors() {
    try {
        const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/S-C-S";
        await mongoose.connect(mongoUri);
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

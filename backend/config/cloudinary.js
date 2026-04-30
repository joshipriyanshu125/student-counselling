import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config();

const cloud_name = process.env.CLOUD_NAME;
const api_key = process.env.CLOUD_API_KEY;
const api_secret = process.env.CLOUD_API_SECRET;

if (!cloud_name || !api_key || !api_secret) {
    console.error("CRITICAL ERROR: Cloudinary environment variables are missing!");
    console.error("Check your .env file in the backend directory.");
    // Don't throw yet, just log clearly
}

console.log("Cloudinary Config Initializing...", {
    cloud_name,
    api_key: api_key ? `${api_key.substring(0, 4)}***` : "MISSING",
});

cloudinary.config({
    cloud_name: cloud_name?.trim(),
    api_key: api_key?.trim(),
    api_secret: api_secret?.trim(),
});

export default cloudinary;